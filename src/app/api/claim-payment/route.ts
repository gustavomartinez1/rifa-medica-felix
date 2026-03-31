import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const ClaimPaymentSchema = z.object({
  ticketIds: z.array(z.string().uuid()),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = ClaimPaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos' },
        { status: 400 }
      );
    }

    const { ticketIds } = parsed.data;

    // Create service role client for admin operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cnboqpyjefjytxxxmykr.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibmJvcHlqZWZqeXR4eHhta3JrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODA2Mjc0MCwiZXhwIjoyMDUzNjM4NzQwfQ.EJ6CGCZNi7I2dc2Lk3zS1wYq6N5pB0vWkqK9xN6bT8M'
    );

    // Update tickets to pending (user claims they made payment)
    const { data: updatedTickets, error: updateError } = await supabase
      .from('tickets')
      .update({
        status: 'pendiente',
        payment_claimed_at: new Date().toISOString(),
      })
      .in('id', ticketIds)
      .eq('status', 'en_espera') // Only update if in en_espera state
      .select();

    if (updateError) throw updateError;

    if (!updatedTickets || updatedTickets.length !== ticketIds.length) {
      return NextResponse.json({
        success: false,
        error: 'Los boletos ya no están en espera. Por favor selecciona nuevamente.',
      });
    }

    return NextResponse.json({
      success: true,
      tickets: updatedTickets,
    });
  } catch (error) {
    console.error('Error claiming payment:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}