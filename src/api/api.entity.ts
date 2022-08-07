import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsString,IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { Resource } from '../resource/resource.entity';


@Entity()
export class Api {
    @IsOptional()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "jsonb", nullable: true })
    data: any;
   
    @ApiProperty()
    @ManyToOne(_type => User,  user => user.apis)
    user: User;

    @ApiProperty()
    @ManyToOne(_type => Resource,  resource => resource.apis)
    resource: Resource;
    
    @IsOptional()
    @CreateDateColumn()
    createdAt:string

    @IsOptional()
    @UpdateDateColumn()
    updatedAt:string
}