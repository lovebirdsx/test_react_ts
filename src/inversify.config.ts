import 'reflect-metadata'
import { Container } from 'inversify'
import { ReactTestManager } from './common/test/ReactTestManager'

const container = new Container();
container.bind<ReactTestManager>(ReactTestManager).toSelf().inSingletonScope();

export default container;
