import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Place extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("varchar", { length: 64 }) name: string;

	@Column("double precision") latitude: number;

	@Column("double precision") longitude: number;
}
