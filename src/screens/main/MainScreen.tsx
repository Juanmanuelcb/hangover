import * as React from 'react';
import { Card, List, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import AddressPicker from './components/AddressPicker';
import ListItem from './components/ListItem';
import DATA from './data.json';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PACK_TYPE_BOTTLE = 'bottle';
const PACK_TYPE_ICE = 'ice';
const PACK_TYPE_MIXER = 'mixer';

const BASE_DELIVERY_PRICE = 5;

const packTypes = [PACK_TYPE_BOTTLE, PACK_TYPE_ICE, PACK_TYPE_MIXER] as const;

type OperationType = 'add' | 'remove';

interface Product {
  id: string;
  name: string;
  price: {
    pack: number;
    base: number;
  };
  type: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface ReducedCartItem {
  quantity: number;
  items: CartItem[];
}

const getTotalQuantity = (item: CartItem[]) => {
  return item.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
};

const getTotal = (list: CartItem[]) => {
  const reduced = list.reduce((acc: { [type: string]: ReducedCartItem }, item: CartItem) => {
    const items = [...(acc[item.type]?.items || []), item].sort((a, b) => b.price.base - a.price.base);
    return {
      ...acc,
      [item.type]: {
        quantity: getTotalQuantity(items),
        items,
      },
    };
  }, {});

  let packs: number | null = null;
  packTypes.forEach((type) => {
    const item = reduced[type];
    if (!item) {
      packs = 0;

      return;
    }

    if (packs === null || item.quantity < packs) {
      packs = item.quantity;
    }
  });

  let totalProducts = 0;
  Object.keys(reduced).forEach((type) => {
    const item = reduced[type];

    item.items.forEach((product) => {
      const productPacks = packs || 0;
      let productBase = product.quantity - productPacks;
      if (productBase < 0) {
        productBase = 0;
      }

      totalProducts += productBase * product.price.base + productPacks * product.price.pack;
    });
  });

  const bottles = reduced[PACK_TYPE_BOTTLE];
  const totalDelivery =
    (bottles ? bottles.quantity : Math.ceil(totalProducts / (BASE_DELIVERY_PRICE * 5))) * BASE_DELIVERY_PRICE;

  return {
    products: totalProducts,
    delivery: totalDelivery,
  };
};

const MainScreen = () => {
  const data = DATA as Product[];
  const insets = useSafeAreaInsets();
  const [products, setProducts] = React.useState<CartItem[]>([]);
  const allowDelivery = false;

  const onPress = React.useCallback(
    (item: Product, type: OperationType) => {
      let newProducts = [...products];
      const index = products.findIndex((p) => p.id === item.id);
      const product = newProducts[index];

      if (type === 'add') {
        if (index === -1) {
          newProducts.push({
            ...item,
            quantity: 1,
          });
        } else {
          product.quantity++;
        }
      } else {
        if (index === -1) {
          return;
        }

        product.quantity--;
        if (product.quantity === 0) {
          newProducts = newProducts.filter((p) => p.id !== product.id);
        }
      }

      setProducts(newProducts);
    },
    [products],
  );

  const total = getTotal(products);
  const sellingTotal = total.products + total.delivery;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top }]}>
        <View style={styles.cards}>
          <Card style={styles.card}>
            <Card.Title title='Products' subtitle='Shopping list' />
            <Card.Content>
              <List.Section>
                {data.map((item: Product) => (
                  <ListItem
                    name={item.name}
                    onAdd={() => onPress(item, 'add')}
                    onRemove={() => onPress(item, 'remove')}
                    quantity={products.find((p) => p.id === item.id)?.quantity || 0}
                    key={item.id}
                  />
                ))}
              </List.Section>
            </Card.Content>
          </Card>
          {allowDelivery && (
            <Card style={styles.card}>
              <Card.Title title='Delivery' />
              <Card.Content>
                <AddressPicker />
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>
      <View style={styles.content}>
        <Card>
          <Card.Title title='Total' />
          <Card.Content>
            <Text>Products: {total.products}€</Text>
            <Text>Delivery: {total.delivery}€</Text>
            <Text>Total: {sellingTotal}€</Text>
            <Text>Selling Total: {Math.ceil(sellingTotal / 5) * 5}€</Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f1f1',
    flex: 1,
  },
  content: {
    padding: 16,
  },
  cards: {
    marginVertical: -8,
  },
  card: {
    marginVertical: 8,
  },
});

export default MainScreen;
