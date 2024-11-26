import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { User } from './User.model';
import { Product } from './Product.model';
import { Profile } from './Profile.model';

@ObjectType()
export class Image {

    @Field(() => ID, {nullable:false})
    id!: string;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => String, {nullable:false})
    authorId!: string;

    @Field(() => User, {nullable:false})
    author?: User;

    @Field(() => [Product], {nullable:true})
    productsAsMain?: Array<Product>;

    @Field(() => [Profile], {nullable:true})
    profiles?: Array<Profile>;

    @Field(() => [Product], {nullable:true})
    productsAsImages?: Array<Product>;
}