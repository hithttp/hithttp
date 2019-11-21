import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsString,IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';


@Entity()
export class Resource {
    @IsOptional()
    @PrimaryGeneratedColumn('uuid')
    id: string;
   
    @Column()
    @IsString()
    name: string;

    @Column({type:"text"})
    @IsString()
    schema: string;

    @Column("text",{array: true})
    method: string[];
   
    @ApiModelProperty()
    @ManyToOne(_type => User,  user => user.id)
    user: User;
    
    @IsOptional()
    @CreateDateColumn()
    createAt:string

    @IsOptional()
    @UpdateDateColumn()
    updatedAt:string
}