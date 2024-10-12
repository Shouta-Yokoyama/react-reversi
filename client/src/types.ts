export interface SquareProps {
    posX: number;
    posY: number;
    state: number;
    key: number;
  };

export  interface InputBoxProps {
    state: string;
    setFn: React.Dispatch<React.SetStateAction<string>>;
    placeholder: string;

}