import { Router, type IRequestStrict } from 'itty-router';
import { handleInteractions } from './routes/interactions';
import { handleRegisterCommands } from './routes/register-commands';

const router = Router<IRequestStrict, [Env, ExecutionContext]>();

router.get('/utils/register-commands', handleRegisterCommands);
router.post('/interactions', handleInteractions);

export default {
    fetch: async (req: Request, env: Env, ctx: ExecutionContext) => {
        try {
            return await router.fetch(req, env, ctx);
        } catch (err) {
            return new Response('Internal Server Error', { status: 500 });
        }
    },
};
