import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm"

export enum StatusContent {
  DRAFTED = "draft",
  PUBLISHED = "published",
  DELETED = "deleted"
}

@Entity()
export class News {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'character',
    length: 160,
    unique: true,
    nullable: false,
  })
  title: string

  @Column("text")
  content: string

  @Column({
    type: "enum",
    enum: StatusContent,
    default: StatusContent.DRAFTED,
    nullable: false,
  })
  status_content: StatusContent

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created_at: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updated_at: string
}