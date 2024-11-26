import { Field, ID, ObjectType } from "@nestjs/graphql";
import { UserRole } from "./UserRole.model";
import { Like } from "./Like.model";
import { Product } from "./Product.model";
import { Profile } from "./Profile.model";
import { Image } from "./Image.model";

@ObjectType()
export class User {

    @Field(() => ID, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    email!: string;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => String, {nullable:true})
    surname!: string | null;

    @Field(() => String, {nullable:false})
    username!: string;

    @Field(() => UserRole, {nullable:false,defaultValue:'USER'})
    role!: keyof typeof UserRole;

    @Field(() => [Like], {nullable:true})
    likes?: Array<Like>;

    @Field(() => [Product], {nullable:true})
    products?: Array<Product>;

    @Field(() => [Image], {nullable:true})
    Images?: Array<Image>;

    @Field(() => Profile, {nullable:true})
    profile?: Profile | null;
}