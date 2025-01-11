import {
	Feather,
	MaterialCommunityIcons,
	MaterialIcons,
} from '@expo/vector-icons';
import React from 'react';
import { Button } from 'tamagui';

interface StatusChipPropsType {
	status: string;
}

export const StatusChip = ({ status }: StatusChipPropsType) => {
	const ChipIcon = () => {
		switch (status) {
			case 'Open':
				return (
					<MaterialCommunityIcons
						name='package-variant'
						size={14}
						color='white'
					/>
				);
			case 'Pending':
				return <MaterialIcons name='pending-actions' size={14} color='white' />;
			case 'Packed':
				return <Feather name='package' size={14} color='white' />;
			case 'Shipped':
				return (
					<MaterialIcons name='local-shipping' size={14} color={'white'} />
				);
		}
	};

	function getColor() {
		switch (status) {
			case 'Open':
			case 'Pending':
				return '$accentColor';
			case 'Packed':
				return '$blue4Dark';
			case 'Shipped':
				return '$green8Dark';
		}
	}

	return (
		<Button icon={<ChipIcon />} backgroundColor={getColor()} disabled size='$2'>
			{status}
		</Button>
	);
};
