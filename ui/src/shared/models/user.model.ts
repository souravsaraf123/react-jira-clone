export interface User
{
	id: number,
	name: string,
	email: string,
	avatarUrl: string,
	createdAt: string,
	updatedAt: string,
	projectId: number,
}

export interface LoginResponse
{
	user: User,
	token: string,
}