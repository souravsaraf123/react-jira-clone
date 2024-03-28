import
{
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	RelationId,
	UpdateDateColumn,
} from 'typeorm';
import { Comment, Issue, Project } from '.';

import is from './../utils/validation';

@Entity()
class User extends BaseEntity
{
	static validations = {
		name: [is.required(), is.maxLength(100)],
		email: [is.required(), is.email(), is.maxLength(200)],
	};

	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar')
	name: string;

	@Column('varchar')
	email: string;

	@Column('varchar', { length: 2000 })
	avatarUrl: string;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt: Date;

	@OneToMany(
		() => Comment,
		comment => comment.user,
	)
	comments: Comment[];

	@ManyToMany(
		() => Issue,
		issue => issue.users,
	)
	issues: Issue[];

	@ManyToOne(
		() => Project,
		project => project.users,
	)
	project: Project;

	@RelationId((user: User) => user.project)
	projectId: number;
}

export default User;
