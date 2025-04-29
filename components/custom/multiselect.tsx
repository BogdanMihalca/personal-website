import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, XCircle, ChevronDown, XIcon, ZapIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { forwardRef, KeyboardEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";

const multiSelectVariants = cva(
  "m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
        cyber:
          "border-neon-cyan/30 text-neon-cyan bg-black/50 hover:bg-black/70 hover:shadow-[0_0_5px_rgba(0,243,255,0.5)]",
        cyberpink:
          "border-neon-pink/40 text-neon-pink bg-black/50 hover:bg-black/70 hover:shadow-[0_0_5px_rgba(255,0,255,0.5)]",
        cybergreen:
          "border-neon-green/40 text-neon-green bg-black/50 hover:bg-black/70 hover:shadow-[0_0_5px_rgba(57,255,20,0.5)]",
        cyberpurple:
          "border-neon-purple/40 text-neon-purple bg-black/50 hover:bg-black/70 hover:shadow-[0_0_5px_rgba(188,19,254,0.5)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface MultiSelectProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof multiSelectVariants> {
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];

  onValueChange?: (value: string[]) => void;
  onChange?: (value: number[]) => void;
  selectedValues?: string[] | number[];
  defaultValue?: string[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  className?: string;
  canSelectAll?: boolean;
  classNames?: {
    input?: string;
    dropdown?: string;
    option?: string;
  };
}

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      onChange,
      variant = "cyber",
      selectedValues: externalSelectedValues,
      defaultValue = [],
      placeholder = "Select options",
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      className,
      classNames,
      canSelectAll = false,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = useState<string[]>(
      externalSelectedValues
        ? externalSelectedValues.map((v) => String(v))
        : defaultValue
    );
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    // Update local state when external selectedValues change
    useEffect(() => {
      if (externalSelectedValues) {
        setSelectedValues(externalSelectedValues.map((v) => String(v)));
      }
    }, [externalSelectedValues]);

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        updateExternalValues(newSelectedValues);
      }
    };

    const updateExternalValues = (values: string[]) => {
      if (onValueChange) {
        onValueChange(values);
      }
      if (onChange) {
        onChange(values.map((v) => Number(v)));
      }
    };

    const toggleOption = (option: string) => {
      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option];
      setSelectedValues(newSelectedValues);
      updateExternalValues(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
      updateExternalValues([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      updateExternalValues(newSelectedValues);
    };

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear();
      } else {
        const allValues = options.map((option) => option.value);
        setSelectedValues(allValues);
        updateExternalValues(allValues);
      }
    };

    // Function to get glowing color based on variant
    const getGlowColor = () => {
      switch (variant) {
        case "cyberpink":
          return "rgba(255, 0, 255, 0.3)";
        case "cybergreen":
          return "rgba(57, 255, 20, 0.3)";
        case "cyberpurple":
          return "rgba(188, 19, 254, 0.3)";
        default:
          return "rgba(0, 243, 255, 0.3)";
      }
    };

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}
      >
        <PopoverTrigger asChild>
          <motion.div
            whileHover={{
              boxShadow: `0 0 8px ${getGlowColor()}`,
            }}
            className="w-full"
          >
            <Button
              ref={ref}
              {...props}
              type="button"
              onClick={handleTogglePopover}
              className={cn(
                "flex w-full p-1 rounded-sm border border-opacity-30 min-h-10 h-auto items-center justify-between bg-black/50 hover:bg-black/70 [&_svg]:pointer-events-auto group",
                className,
                classNames?.input
              )}
            >
              {selectedValues.length > 0 ? (
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-wrap items-center">
                    {selectedValues.slice(0, maxCount).map((value) => {
                      const option = options.find((o) => o.value === value);
                      const IconComponent = option?.icon;
                      return (
                        <Badge
                          key={value}
                          className={cn(multiSelectVariants({ variant }))}
                        >
                          {IconComponent && (
                            <IconComponent className="h-4 w-4 mr-2" />
                          )}
                          {option?.label}
                          <XCircle
                            className="ml-2 h-4 w-4 cursor-pointer hover:text-white"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleOption(value);
                            }}
                          />
                        </Badge>
                      );
                    })}
                    {selectedValues.length > maxCount && (
                      <Badge
                        className={cn(
                          "bg-black/50 border border-opacity-30 hover:bg-black/70",
                          multiSelectVariants({ variant })
                        )}
                        style={{ animationDuration: `${animation}s` }}
                      >
                        {`+ ${selectedValues.length - maxCount} more`}
                        <XCircle
                          className="ml-2 h-4 w-4 cursor-pointer hover:text-white"
                          onClick={(event) => {
                            event.stopPropagation();
                            clearExtraOptions();
                          }}
                        />
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <XIcon
                      className="h-4 mx-2 cursor-pointer text-muted-foreground hover:text-white"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleClear();
                      }}
                    />
                    <Separator
                      orientation="vertical"
                      className="flex min-h-6 h-full opacity-30"
                    />
                    <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground group-hover:text-white" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full mx-auto">
                  <span className="text-sm text-muted-foreground mx-3 group-hover:text-white/80">
                    {placeholder}
                  </span>
                  <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2 group-hover:text-white" />
                </div>
              )}
            </Button>
          </motion.div>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-full p-0 border border-opacity-30 bg-black/90 backdrop-blur-md",
            classNames?.dropdown
          )}
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command className="bg-transparent">
            <CommandInput
              placeholder="Search..."
              onKeyDown={handleInputKeyDown}
              className="bg-black/50 border-b border-opacity-30"
            />
            <CommandList className="max-h-60 scrollbar-thin scrollbar-thumb-neon-cyan/30 scrollbar-track-transparent">
              <CommandEmpty className="py-2 px-1 text-sm text-muted-foreground">
                <div className="flex items-center justify-center space-x-2">
                  <ZapIcon className="h-4 w-4 text-muted-foreground" />
                  <span>No matches found.</span>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {canSelectAll && (
                  <CommandItem
                    key="all"
                    onSelect={toggleAll}
                    className={cn(
                      "cursor-pointer hover:bg-black/50 hover:text-white group/item",
                      classNames?.option
                    )}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                        selectedValues.length === options.length
                          ? "bg-gradient-to-r from-neon-purple/50 to-neon-cyan/50 border-neon-cyan"
                          : "border-neon-cyan/30 opacity-70 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </motion.div>
                    <span className="group-hover/item:text-neon-cyan">
                      (Select All)
                    </span>
                  </CommandItem>
                )}
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      className={cn(
                        "cursor-pointer hover:bg-black/50 group/item",
                        classNames?.option
                      )}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                          isSelected
                            ? "bg-gradient-to-r from-neon-purple/50 to-neon-cyan/50 border-neon-cyan"
                            : "border-neon-cyan/30 opacity-70 [&_svg]:invisible"
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </motion.div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span
                        className={
                          isSelected
                            ? "text-neon-cyan"
                            : "group-hover/item:text-neon-cyan/80"
                        }
                      >
                        {option.label}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator className="bg-neon-cyan/10" />
              <CommandGroup>
                <div className="flex items-center justify-between">
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem
                        onSelect={handleClear}
                        className="flex-1 justify-center cursor-pointer hover:text-neon-pink"
                      >
                        Clear
                      </CommandItem>
                      <Separator
                        orientation="vertical"
                        className="flex min-h-6 h-full bg-neon-cyan/10"
                      />
                    </>
                  )}
                  <CommandItem
                    onSelect={() => setIsPopoverOpen(false)}
                    className="flex-1 justify-center cursor-pointer max-w-full hover:text-neon-cyan"
                  >
                    Close
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";
