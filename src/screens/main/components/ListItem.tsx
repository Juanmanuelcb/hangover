import * as React from 'react';
import { Button, List, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

interface Props {
  name: string;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

const ListItem: React.FC<Props> = ({ name, onAdd, onRemove, quantity }) => {
  return (
    <List.Item
      title={name}
      right={() => (
        <View style={styles.quantity}>
          <Button icon='minus-circle' mode='text' onPress={onRemove} compact>
            {''}
          </Button>
          <Text style={styles.label}>{quantity}</Text>
          <Button icon='plus-circle' mode='text' onPress={onAdd} compact>
            {''}
          </Button>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  quantity: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  label: {
    textAlign: 'center',
    width: 50,
  },
});

export default ListItem;
