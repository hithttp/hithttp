import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsString,IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';


@Entity()
export class Resource {
    @IsOptional()
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column({type:"text"})
    @IsString()
    model: string;

    @Column("text",{array: true})
    method: string[];
   
    @Column("uuid")
    @ManyToOne(_type => User, {
        cascade: true
    })
    @JoinColumn({ name: "userId" })
    @ApiModelProperty()
    userId: string;
    
    @IsOptional()
    @CreateDateColumn()
    createAt:string

    @IsOptional()
    @UpdateDateColumn()
    updatedAt:string
}