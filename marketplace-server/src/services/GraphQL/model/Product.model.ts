import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { Like } from './Like.model';
import { User } from './User.model';
import { Category } from './Category.model';
import { Image } from './Image.model';

@ObjectType()
export class Product {

    @Field(() => ID, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    title!: string;

    @Field(() => Int, {nullable:false})
    price!: number;

    @Field(() => String, {nullable:true})
    description!: string | null;

    @Field(() => Int, {nullable:false,defaultValue:0})
    likes!: number;

    @Field(() => String, {nullable:true})
    mainImageId!: string | null;

    @Field(() => String, {nullable:false})
    authorId!: string;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => Image, {nullable:true})
    mainImage?: Image | null;

    @Field(() => [Image], {nullable:true})
    images?: Array<Image>;

    @Field(() => [Category], {nullable:true})
    categories?: Array<Category>;

    @Field(() => [Like], {nullable:true})
    Like?: Array<Like>;

    @Field(() => User, {nullable:false})
    author?: User;
}
