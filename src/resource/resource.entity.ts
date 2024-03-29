import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsString,IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { Api } from '../api/api.entity';


@Entity()
export class Resource {
    @IsOptional()
    @PrimaryGeneratedColumn('uuid')
    id: string;
   
    @Column()
    @IsString()
    name: string;

    @Column({ type: "jsonb", nullable: true })
    // @IsString()
    schema: any;

    @ApiProperty()
    @ManyToOne(_type => User,  user => user.resources)
    user: User;
    
    @OneToMany(type => Api, api => api.resource)
    apis: Api[];

    @IsOptional()
    @CreateDateColumn()
    createAt:string

    @IsOptional()
    @UpdateDateColumn()
    updatedAt:string
}