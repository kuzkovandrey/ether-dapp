import { getGasPriorityFee } from '@/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  const fees = await getGasPriorityFee();

  // TODO: Add try/catch
  return Response.json(fees);
}
