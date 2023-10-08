import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm"

@Entity()
export class Topics {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'character',
        length: 60,
        unique: true,
        nullable: false,
    })
    category_name: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at: string
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updated_at: string
}