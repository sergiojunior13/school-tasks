import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ModalProps,
} from "react-native";

export interface ModalWithStateProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Root({ children, ...rest }: ModalProps) {
  return (
    <Modal {...rest} transparent>
      <View className="bg-black/70 flex-1 items-center justify-center px-10">
        <View className="bg-zinc-800 w-full rounded-xl p-4">{children}</View>
      </View>
    </Modal>
  );
}

export function Header({ children }: ModalProps) {
  return <View className="flex-row justify-between items-center mb-4">{children}</View>;
}

export function HeaderText({ children }: ModalProps) {
  return <Text className="text-zinc-300 font-sans-bold text-xl">{children}</Text>;
}

export function Content({ children, className }: ModalProps) {
  return <View className={className}>{children}</View>;
}

export function ContentText({ children, className, ...rest }: ModalProps) {
  return (
    <Text {...rest} className={"font-sans text-base text-zinc-50 " + className}>
      {children}
    </Text>
  );
}

export function Button({ children, ...rest }: TouchableOpacityProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} {...rest}>
      {children}
    </TouchableOpacity>
  );
}
