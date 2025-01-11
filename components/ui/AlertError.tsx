import { AlertDialog, Button, XStack, YStack } from 'tamagui';

interface AlertErrorPropsType {
	open: boolean;
	setOpen: any;
	error: any;
}
export function AlertError({ open, setOpen, error }: AlertErrorPropsType) {
	return (
		<AlertDialog native open={open} onOpenChange={setOpen}>
			<AlertDialog.Trigger />
			<AlertDialog.Portal>
				<AlertDialog.Overlay
					key='overlay'
					animation='quick'
					opacity={0.5}
					enterStyle={{ opacity: 0 }}
					exitStyle={{ opacity: 0 }}
				/>
				<AlertDialog.Content
					bordered
					elevate
					key='content'
					animation={[
						'quick',
						{
							opacity: {
								overshootClamping: true,
							},
						},
					]}
					enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
					exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
					x={0}
					scale={1}
					opacity={1}
					y={0}>
					<YStack space>
						<AlertDialog.Title>{error.title}</AlertDialog.Title>
						<AlertDialog.Description>
							{error.description}
						</AlertDialog.Description>

						<XStack gap='$3' justifyContent='flex-end'>
							<AlertDialog.Cancel asChild>
								<Button>Cancel</Button>
							</AlertDialog.Cancel>
							<AlertDialog.Action asChild>
								<Button theme='active'>Accept</Button>
							</AlertDialog.Action>
						</XStack>
					</YStack>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog>
	);
}
