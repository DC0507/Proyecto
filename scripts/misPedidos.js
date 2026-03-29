import { supabase } from "./supabase.js";

// Helper for CRC Formatting
const formatCRC = (val) => new Intl.NumberFormat('es-CR', {
    style: 'currency', currency: 'CRC', minimumFractionDigits: 0 
}).format(val);

async function loadMyOrders() {
    const container = document.getElementById('orders-list');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: orders, error } = await supabase
        .from('pedidos')
        .select(`
            id, total, fecha_pedido,
            pedido_detalles (
                cantidad,
                productos ( nombre, precio )
            )
        `)
        .eq('usuario_id', user.id)
        .eq('estado', 'completado')
        .order('fecha_pedido', { ascending: false });

    if (error) { container.innerHTML = `<p>${error.message}</p>`; return; }

    container.innerHTML = orders.map(order => `
        <div class="order-card" style="border: 1px solid #eee; padding: 15px; margin-bottom: 15px; border-radius: 10px; background: white;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px;">
                <strong>Pedido #${order.id}</strong>
                <span>${new Date(order.fecha_pedido).toLocaleDateString('es-CR')}</span>
            </div>
            
            <div style="padding: 10px 0;">
                ${order.pedido_detalles.map(item => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>${item.productos?.nombre} <small>(x${item.cantidad})</small></span>
                        <!-- Getting price from table productos -->
                        <span>${formatCRC(item.productos?.precio || 0)}</span>
                    </div>
                `).join('')}
            </div>

            <div style="text-align: right; border-top: 1px solid #f0f0f0; pt: 10px; margin-top: 5px;">
                <span style="font-size: 1.2rem; font-weight: bold; color: #2ecc71;">
                    Total: ${formatCRC(order.total)}
                </span>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', loadMyOrders);
