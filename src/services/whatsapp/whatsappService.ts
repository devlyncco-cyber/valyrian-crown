import { CartItem, CustomerDetails } from '@/types';
import { productService } from '../products/productService';

export interface WhatsAppCheckoutResult {
  success: boolean;
  message?: string;
  error?: string;
  whatsappUrl?: string;
  unavailableItems?: string[];
  refreshedItems?: CartItem[];
  total?: number;
}

export const whatsappService = {
  /**
   * Validates cart items against database, refreshes prices, checks availability,
   * and prepares the WhatsApp checkout message with customer details.
   */
  async validateAndPrepareCheckout(
    items: CartItem[],
    customer?: CustomerDetails,
    recipientPhone: string = '233509758180',
    currencySymbol: string = 'GH₵'
  ): Promise<WhatsAppCheckoutResult> {
    if (!items || items.length === 0) {
      return {
        success: false,
        error: 'Your shopping cart is empty.',
      };
    }

    const unavailableItems: string[] = [];
    const refreshedItems: CartItem[] = [];

    // Verify each product currently in cart
    for (const item of items) {
      const freshProduct = await productService.getProductById(item.product.id);

      if (!freshProduct || !freshProduct.is_published || freshProduct.availability_status === 'out_of_stock') {
        unavailableItems.push(item.product.name);
        continue;
      }

      // Check stock if inventory tracking is set
      if (
        freshProduct.stock_quantity !== null &&
        freshProduct.stock_quantity !== undefined &&
        freshProduct.stock_quantity < item.quantity
      ) {
        unavailableItems.push(`${freshProduct.name} (Only ${freshProduct.stock_quantity} left in stock)`);
        continue;
      }

      refreshedItems.push({
        ...item,
        product: freshProduct,
      });
    }

    if (unavailableItems.length > 0) {
      return {
        success: false,
        error: `Some items in your cart are currently unavailable or out of stock: ${unavailableItems.join(', ')}`,
        unavailableItems,
      };
    }

    // Build the order message
    let total = 0;
    const itemLines: string[] = [];

    refreshedItems.forEach((item, index) => {
      const effectivePrice = item.product.sale_price !== null && item.product.sale_price !== undefined
        ? Number(item.product.sale_price)
        : Number(item.product.price);

      const subtotal = effectivePrice * item.quantity;
      total += subtotal;

      const variantDetail = item.selectedVariant ? ` (${item.selectedVariant})` : '';
      const sizeDetail = item.selectedSize ? ` [${item.selectedSize}]` : '';

      itemLines.push(
        `${index + 1}. ${item.product.name}${variantDetail}${sizeDetail}\n` +
        `   Quantity: ${item.quantity}\n` +
        `   Unit Price: ${currencySymbol}${effectivePrice.toFixed(2)}\n` +
        `   Subtotal: ${currencySymbol}${subtotal.toFixed(2)}`
      );
    });

    // Customer details section
    const customerLines: string[] = [];
    if (customer && (customer.name || customer.contact || customer.location)) {
      customerLines.push('CUSTOMER DETAILS:');
      if (customer.name) customerLines.push(`• Name: ${customer.name}`);
      if (customer.contact) customerLines.push(`• Contact: ${customer.contact}`);
      if (customer.location) customerLines.push(`• Delivery Location: ${customer.location}`);
      if (customer.notes) customerLines.push(`• Special Notes: ${customer.notes}`);
      customerLines.push('');
    }

    const messageParts: string[] = [
      'Hello ValyrianCrown! I would like to place an order.',
      '',
    ];

    if (customerLines.length > 0) {
      messageParts.push(...customerLines);
    }

    messageParts.push(
      'MY ORDER:',
      '',
      itemLines.join('\n\n'),
      '',
      `ITEMS TOTAL: ${currencySymbol}${total.toFixed(2)}`,
      'DELIVERY FEE: To be calculated and confirmed in chat based on my location',
      '',
      'Please let me know the delivery fee and payment details to proceed with my order.',
      '',
      'Thank you!'
    );

    const formattedMessage = messageParts.join('\n');

    // Clean phone number (strip spaces, symbols, ensure 233 format)
    let cleanPhone = recipientPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '233' + cleanPhone.slice(1);
    }

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(formattedMessage)}`;

    return {
      success: true,
      message: formattedMessage,
      whatsappUrl,
      refreshedItems,
      total,
    };
  },
};
