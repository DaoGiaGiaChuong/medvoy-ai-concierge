import OptionCard, { Option } from "./OptionCard";

interface OptionsGridProps {
  options: Option[];
  onSelectOption?: (option: Option) => void;
}

const OptionsGrid = ({ options, onSelectOption }: OptionsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
      {options.map((option) => (
        <OptionCard
          key={option.id}
          option={option}
          onSelect={onSelectOption}
        />
      ))}
    </div>
  );
};

export default OptionsGrid;
