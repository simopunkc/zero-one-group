import {
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { News } from "@api/src/entity/News"
import { Topics } from "@api/src/entity/Topics"

@Index(["news_id", "news_id"], { unique: true })
@Entity()
export class RefNewsTopics {
  @PrimaryGeneratedColumn()
  id: number
  
  @Column({
    type: 'integer',
    nullable: false,
  })
  @OneToOne(() => News, (news) => news.id, {
    cascade: true,
  })
  news_id: number

  @Column({
    type: 'integer',
    nullable: false,
  })
  @OneToOne(() => Topics, (topics) => topics.id, {
    cascade: true,
  })
  topics_id: number
}