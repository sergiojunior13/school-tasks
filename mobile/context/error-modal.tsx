import { createContext, useState } from "react";
import { TouchableOpacity } from "react-native";

import colors from "tailwindcss/colors";

import * as Modal from "../src/components/Modal";
import { Icon } from "../src/components/Icon";

interface ErrorModalData {
  tryFunctionOrThrowError: (functionCode: Function) => Promise<void>;
}

export const ErrorModalContext = createContext<ErrorModalData>(null);

export function ErrorModalContextProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error>();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  async function tryFunctionOrThrowError(functionCode: Function) {
    try {
      await functionCode();
    } catch (error) {
      setError(error);
      setIsErrorModalOpen(true);

      setTimeout(() => setIsErrorModalOpen(false), 7 * 1000);
    }
  }

  return (
    <ErrorModalContext.Provider value={{ tryFunctionOrThrowError }}>
      {error && (
        <Modal.Root visible={isErrorModalOpen}>
          <Modal.Header>
            <Modal.HeaderText>{error.name}</Modal.HeaderText>

            <TouchableOpacity activeOpacity={0.7} onPress={() => setIsErrorModalOpen(false)}>
              <Icon name="x" color={colors.red[600]} size={32} />
            </TouchableOpacity>
          </Modal.Header>

          <Modal.Content>
            <Modal.ContentText>{error.message}</Modal.ContentText>
            {error.cause !== undefined && (
              <Modal.ContentText>{String(error.cause)}</Modal.ContentText>
            )}
          </Modal.Content>
        </Modal.Root>
      )}

      {children}
    </ErrorModalContext.Provider>
  );
}
