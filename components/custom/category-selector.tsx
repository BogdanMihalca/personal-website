import { useEffect, useState } from "react";
import { getAllCategories } from "@/lib/db-actions/category-actions";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategorySelectorProps {
  value?: number;
  onChange: (value?: number) => void;
}

export default function CategorySelector({
  value,
  onChange,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { categories } = await getAllCategories({ returnAll: true });
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="relative">
      {isLoading ? (
        <div className="bg-black/50 border border-neon-purple/30 rounded-sm p-2 h-10 flex items-center">
          <div className="w-24 h-4 bg-neon-purple/20 rounded-sm animate-pulse"></div>
        </div>
      ) : (
        <select
          className="w-full p-2 bg-black/50 border border-neon-purple/30 rounded-sm text-zinc-200 appearance-none focus:border-neon-purple focus:outline-none"
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)
          }
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      )}

      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neon-purple">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}
