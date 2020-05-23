import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from './Recipe';
import { SeasonIngredient } from './SeasonIngredient';

@Entity()
@ObjectType({ description: '청명님께서 정리한 trim 된 레시피' })
export class TrimmedRecipe extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  @ObjectIdColumn()
  _id: string;

  @Field()
  @Column()
  recipeId: number; // 레시피 ID

  @Field(() => Recipe)
  @Column()
  recipeName: string; // 레시피명

  @Field(() => SeasonIngredient)
  @Column()
  seasonIngredientId: number; // 재철 식재료 ID

  @Field()
  @Column()
  seasonIngredientName: string; // 재철 식재료 이름

  @Field()
  @Column()
  seasonMonth: number; // 재철 식재료 월

  @Field()
  @Column()
  cookingLevel: string; // 요리난이도

  @Field()
  @Column()
  cookingTime: string; // 요리시간

  @Field()
  @Column()
  category: string; // 음식분류명

  @Field()
  @Column()
  ingredientCategory: string; // 재료분류
}
