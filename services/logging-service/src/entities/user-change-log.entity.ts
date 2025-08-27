import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserChangeEventType {
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
}

@Entity('user_change_logs')
export class UserChangeLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserChangeEventType,
  })
  eventType: UserChangeEventType;

  @Column()
  userId: string;

  @Column({ type: 'jsonb' })
  userData: any;

  @Column({ type: 'jsonb', nullable: true })
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
