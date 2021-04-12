import * as React from 'react';
import { Button, Card, List, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import AddressPicker from './components/AddressPicker';
import ListItem from './components/ListItem';
import DATA from './data.json';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type OperationType = 'add' | 'remove';
type ProductType = 'bottle' | 'ice' | 'drink';

interface Product {
  id: string;
  name: string;
  price: {
    pack: number;
    base: number;
  };
  type: ProductType;
}

interface CartItem extends Product {
  quantity: number;
}

const getTotal = (list: CartItem[]) => {
  const reduced = list.reduce(
    (acc: { [type: string]: Product[] }, item: CartItem) => ({
      ...acc,
      [item.type]: [...(acc[item.type] || []), item].sort((a, b) => b.price.base - a.price.base),
    }),
    {
      bottle: [],
      ice: [],
      drink: [],
    },
  );

  const packs = reduced;
  return 0;
};

const MainScreen = () => {
  const data = DATA as Product[];
  const insets = useSafeAreaInsets();
  const [products, setProducts] = React.useState<CartItem[]>([]);

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
          <Card style={styles.card}>
            <Card.Title title='Delivery' />
            <Card.Content>
              <AddressPicker />
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
      <Card style={styles.card}>
        <Card.Title title='Total' />
        <Card.Content>
          <Text>Products: 0€</Text>
          <Text>Delivery: 0€</Text>
          <Button onPress={() => getTotal(products)}>Get total</Button>
        </Card.Content>
      </Card>
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
