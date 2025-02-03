import { 
  Entity, 
  BaseEntity, 
  PrimaryGeneratedColumn, 
  Column 
} from "typeorm";

@Entity('cards')
export class Card extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  code: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 20 })
  rarity: string;

  @Column({ length: 100, nullable: true })
  attribute: string;

  @Column({ length: 50, nullable: true })
  species: string;

  @Column({ type: 'int', nullable: true })
  cost: number;

  @Column({ type: 'text', nullable: true })
  mission: string;

  @Column({ type: 'text', nullable: true })
  legend: string;

  @Column({ length: 255, nullable: true })
  image: string;

}