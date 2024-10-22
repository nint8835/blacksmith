import { AutoRouter, type IRequest } from 'itty-router';
import { handleRegisterCommands } from './routes/register-commands';

const router = AutoRouter<IRequest, [Env, ExecutionContext]>() satisfies ExportedHandler<Env>;

router.get('/utils/register-commands', handleRegisterCommands);

export default { ...router };
