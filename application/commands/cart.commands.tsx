import { CartItem, CartState, MobileProduct } from "@/core/entities/mobile.entity";
import { Result, ResultFactory } from "@/core/errors/app-error";

// Command Definitions (Write Intentions)
export type CartCommand =
  | { type: "ADD_ITEM"; payload: { product: MobileProduct } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: number; quantity: number } }
  | { type: "REMOVE_SINGLE_ITEM"; payload: { productId: number } }
  | { type: "TOGGLE_SELECT_FOR_REMOVAL"; payload: { productId: number } }
  | { type: "REMOVE_SELECTED_ITEMS" }
  | { type: "CLEAR_CART" };

export class CartCommandHandler {
  // Recalculate cart totals cleanly after every state mutation
  private static calculateTotals(items: CartItem[]): CartState {
    const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalOriginalPrice = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const totalPayablePrice = items.reduce(
      (sum, item) => sum + item.product.discountedPrice * item.quantity,
      0
    );

    return {
      items,
      totalItemsCount,
      totalOriginalPrice: Math.round(totalOriginalPrice),
      totalPayablePrice: Math.round(totalPayablePrice),
    };
  }

  // Execute incoming cart command and return updated CartState wrapped in Result
  public static execute(currentState: CartState, command: CartCommand): Result<CartState> {
    try {
      let updatedItems = [...currentState.items];

      switch (command.type) {
        case "ADD_ITEM": {
          const { product } = command.payload;
          if (product.stock <= 0) {
            return ResultFactory.failure("This mobile is currently out of stock", "VALIDATION_ERROR");
          }

          const existingIndex = updatedItems.findIndex((i) => i.product.id === product.id);
          if (existingIndex > -1) {
            const currentItem = updatedItems[existingIndex];
            if (currentItem.quantity + 1 > product.stock) {
              return ResultFactory.failure("Cannot exceed available stock limit", "VALIDATION_ERROR");
            }
            updatedItems[existingIndex] = {
              ...currentItem,
              quantity: currentItem.quantity + 1,
            };
          } else {
            updatedItems.push({
              product,
              quantity: 1,
              selectedForRemoval: false,
            });
          }
          break;
        }

        case "UPDATE_QUANTITY": {
          const { productId, quantity } = command.payload;
          if (quantity <= 0) {
            updatedItems = updatedItems.filter((i) => i.product.id !== productId);
          } else {
            updatedItems = updatedItems.map((item) =>
              item.product.id === productId
                ? { ...item, quantity: Math.min(quantity, item.product.stock) }
                : item
            );
          }
          break;
        }

        case "REMOVE_SINGLE_ITEM": {
          updatedItems = updatedItems.filter((i) => i.product.id !== command.payload.productId);
          break;
        }

        case "TOGGLE_SELECT_FOR_REMOVAL": {
          updatedItems = updatedItems.map((item) =>
            item.product.id === command.payload.productId
              ? { ...item, selectedForRemoval: !item.selectedForRemoval }
              : item
          );
          break;
        }

        case "REMOVE_SELECTED_ITEMS": {
          const hasSelected = updatedItems.some((item) => item.selectedForRemoval);
          if (!hasSelected) {
            return ResultFactory.failure("No items selected for bulk removal", "VALIDATION_ERROR");
          }
          updatedItems = updatedItems.filter((item) => !item.selectedForRemoval);
          break;
        }

        case "CLEAR_CART": {
          updatedItems = [];
          break;
        }
      }

      return ResultFactory.success(this.calculateTotals(updatedItems));
    } catch (error) {
      return ResultFactory.failure("Failed to process cart command", "UNKNOWN_ERROR");
    }
  }
}