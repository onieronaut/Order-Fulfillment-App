import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import type { SheetProps } from '@tamagui/sheet';
import { Sheet } from '@tamagui/sheet';
import React, { memo } from 'react';
import { Button, H2, Input, Paragraph, XStack, YStack } from 'tamagui';

export const SheetModal = ({}) => {
	const [position, setPosition] = React.useState(0);
	const [open, setOpen] = React.useState(false);

	return (
		<>
			<Button
				onPress={() => {
					console.log(open);
					setOpen(true);
				}}>
				x
			</Button>

			<Sheet
				forceRemoveScrollEnabled={open}
				modal={true}
				open={open}
				onOpenChange={setOpen}
				snapPoints={[80, 50]}
				snapPointsMode={'percent'}
				dismissOnSnapToBottom
				position={position}
				onPositionChange={setPosition}
				zIndex={100_000}
				animation='medium'>
				<Sheet.Overlay
					animation='lazy'
					enterStyle={{ opacity: 0 }}
					exitStyle={{ opacity: 0 }}
				/>

				<Sheet.Handle />
				<Sheet.Frame
					padding='$4'
					justifyContent='center'
					alignItems='center'
					gap='$5'>
					<SheetContents />
				</Sheet.Frame>
			</Sheet>
		</>
	);
};

const SheetContents = memo(() => {
	return (
		<>
			<Input width={200} />
		</>
	);
});
