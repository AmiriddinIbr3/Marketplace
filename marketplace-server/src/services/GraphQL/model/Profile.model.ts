import { Field, ID, ObjectType } from "@nestjs/graphql";
import { User } from "./User.model";
import { Image } from "./Image.model";

@ObjectType()
export class Profile {

    @Field(() => ID, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:true})
    description!: string | null;

    @Field(() => String, {nullable:false})
    userId!: string;

    @Field(() => [Image], {nullable:true})
    avatars?: Array<Image>;

    @Field(() => User, {nullable:false})
    user?: User;
}