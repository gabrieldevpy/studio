
import { NextRequest, NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase/server';

async function verifyUser(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }
    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await verifyUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
        }

        const { planName, priceId } = await req.json();

        if (!planName || !priceId) {
            return NextResponse.json({ error: 'Nome do plano e ID do preço são obrigatórios.' }, { status: 400 });
        }

        // ===================================================================================
        // LÓGICA DE INTEGRAÇÃO COM PROVEDOR DE PAGAMENTO (EX: STRIPE)
        // ===================================================================================
        // 1. Verifique se o usuário já tem uma assinatura ativa ou um customer ID no Stripe.
        //    const userDoc = await db.collection('users').doc(user.uid).get();
        //    const userData = userDoc.data();
        //    let stripeCustomerId = userData.stripeCustomerId;
        //
        //    if (!stripeCustomerId) {
        //        // 2. Crie um novo cliente no Stripe se não existir.
        //        const customer = await stripe.customers.create({ email: user.email, name: user.name });
        //        stripeCustomerId = customer.id;
        //        await db.collection('users').doc(user.uid).update({ stripeCustomerId });
        //    }
        //
        // 3. Crie uma sessão de checkout no Stripe.
        //    const session = await stripe.checkout.sessions.create({
        //        customer: stripeCustomerId,
        //        payment_method_types: ['card'],
        //        line_items: [{ price: priceId, quantity: 1 }],
        //        mode: 'subscription', // ou 'payment' para pagamentos únicos
        //        success_url: `${req.nextUrl.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        //        cancel_url: `${req.nextUrl.origin}/settings`,
        //    });
        //
        // 4. Retorne a URL da sessão de checkout.
        //    return NextResponse.json({ checkoutUrl: session.url });
        // ===================================================================================

        // **INÍCIO: Lógica de Simulação (Remover em produção)**
        // Para este protótipo, vamos apenas atualizar o plano do usuário diretamente no Firestore.
        // Em um aplicativo real, isso seria feito por um webhook após o pagamento ser confirmado.
        const userRef = db.collection('users').doc(user.uid);
        await userRef.update({
            plan: planName,
        });
        
        return NextResponse.json({ success: true, message: 'Plano atualizado com sucesso (simulação).' });
        // **FIM: Lógica de Simulação**

    } catch (error: any) {
        console.error("Checkout API error:", error);
        return NextResponse.json({ error: error.message || 'Ocorreu um erro no servidor.' }, { status: 500 });
    }
}
