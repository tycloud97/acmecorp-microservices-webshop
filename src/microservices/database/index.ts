require('source-map-support').install();

import { ApolloServer } from 'apollo-server-lambda';

import { resolvers } from './frameworks/resolvers';
import { typeDefs } from './frameworks/typeDefs';
import wrap from '@dazn/lambda-powertools-pattern-basic';
import { withMiddlewares } from '../../common/Tracing/middleware';

export const server = wrap(withMiddlewares(new ApolloServer({ resolvers, typeDefs }).createHandler()));
