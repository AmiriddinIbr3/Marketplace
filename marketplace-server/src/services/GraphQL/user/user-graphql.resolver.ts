import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { GraphqlUserService } from "./user-grapthql.service";
import { User } from "../model/User.model";

@Resolver(() => User)
export class GraphqlUserResolver {
    constructor(private readonly graphqlUserService: GraphqlUserService) {}
    
    @Query(() => User)
    async getUserById(@Args('id', { type: () => String }) id: string) {
        return await this.graphqlUserService.findUserById(id);
    }
}