import { AutoRouter, type IRequestStrict } from 'itty-router';
import { handleInteractions } from './routes/interactions';
import { handleRegisterCommands } from './routes/register-commands';

const router = AutoRouter<IRequestStrict, [Env, ExecutionContext]>() satisfies ExportedHandler<Env>;

router.get('/utils/register-commands', handleRegisterCommands);
router.post('/interactions', handleInteractions);

export default { ...router };
