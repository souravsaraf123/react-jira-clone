import "./Button.css";

import tinycolor from "tinycolor2";

export enum ButtonPalette
{
	primary = "primary",
	secondary = "secondary",
	success = "success",
	danger = "danger",
	warning = "warning",
	ghost = "ghost",
	light = "light",
	dark = "dark",
}

export enum ButtonSize
{
	smallest = "smallest",
	small = "small",
	regular = "regular",
	medium = "medium",
	large = "large",
	largest = "largest",
}

export enum ButtonFilled
{
	filled = "filled",
	outline = "outline",
	link = "link",
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>
{
	children?: React.ReactNode;
	palette?: ButtonPalette,
	size?: ButtonSize,
	filled?: ButtonFilled;
}

export function Button(props: ButtonProps)
{
	const {
		children,
		palette = ButtonPalette.primary,
		size = ButtonSize.regular,
		filled = ButtonFilled.filled,
		className,
		style,
		...htmlButtonProps
	} = props;

	let styleViaProps: {
		color: string,
		backgroundColor: string,
		borderColor: string,
		"--hoverBackgroundColor": string,
		"--activeBackgroundColor": string,

		fontSize: string,
		paddingInline: string,
		paddingBlock: string,
		borderRadius: string,
	} = {
		color: "",
		backgroundColor: "",
		borderColor: "",
		"--hoverBackgroundColor": "",
		"--activeBackgroundColor": "",
		fontSize: "",
		paddingInline: "",
		borderRadius: "",
		paddingBlock: "",
	};

	// link
	if (filled === ButtonFilled.link)
	{
		styleViaProps.color = `var(--${palette})`;
		styleViaProps.backgroundColor = "transparent";
		styleViaProps.borderColor = "transparent";
		styleViaProps["--hoverBackgroundColor"] = `var(--secondaryLight)`; // secondary light
		styleViaProps["--activeBackgroundColor"] = `var(--secondaryDark)`; // secondary dark
	}
	// outline
	else if (filled === ButtonFilled.outline)
	{
		styleViaProps.color = `var(--${palette})`;
		styleViaProps.backgroundColor = "transparent";
		styleViaProps.borderColor = `var(--${palette})`;
		styleViaProps["--hoverBackgroundColor"] = `var(--secondaryLight)`; // secondary light
		styleViaProps["--activeBackgroundColor"] = `var(--secondaryDark)`; // secondary dark
	}
	// filled
	else
	{
		styleViaProps.backgroundColor = `var(--${palette})`;

		// Get Button Text Color based on background color
		let hex = getComputedStyle(document.documentElement).getPropertyValue(`--${palette}`);
		if (hex === "transparent")
		{
			hex = "#ffffff";
		}
		let isLight = tinycolor(hex).isLight();
		styleViaProps.color = isLight ? `var(--dark)` : `var(--light)`;

		styleViaProps.borderColor = `var(--${palette})`;
		styleViaProps["--hoverBackgroundColor"] = `var(--${palette}Light)`;
		styleViaProps["--activeBackgroundColor"] = `var(--${palette}Dark)`;
	}

	// Size
	let calculatedSize = `var(--fz${size.charAt(0).toUpperCase() + size.slice(1)})`;
	styleViaProps.fontSize = calculatedSize;
	styleViaProps.paddingInline = calculatedSize;
	styleViaProps.paddingBlock = `calc(${calculatedSize} / 2)`;
	styleViaProps.borderRadius = `calc(${calculatedSize} / 3)`;

	let finalClasses = 'btn ' + (className || '');
	let finalStyles = { ...styleViaProps, ...style };

	return <button className={finalClasses} style={finalStyles} {...htmlButtonProps}>{children}</button>;
}