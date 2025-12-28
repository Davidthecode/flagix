import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FlagRuleCard } from "@/components/flags/flag-rule-card";
import type { FlagVariation, TargetingRule } from "@/types/flag";

const arrayMove = <T,>(arr: T[], from: number, to: number): T[] => {
  const newArr = [...arr];
  const item = newArr[from];
  newArr.splice(from, 1);
  newArr.splice(to, 0, item);
  return newArr;
};

type SortableItemProps = {
  rule: TargetingRule & { id: string };
  variations: FlagVariation[];
  isEditable: boolean;
  isDeletingRule: boolean;
  onEdit: (rule: TargetingRule) => void;
  onDelete: (ruleId: string, onSuccess?: () => void) => void;
};

interface RuleCardActionProps {
  isEditable: boolean;
  isDeletingRule: boolean;
  variations: FlagVariation[];
  onEdit: (rule: TargetingRule) => void;
  onDelete: (ruleId: string, onSuccess?: () => void) => void;
}

interface SortableRuleListProps extends RuleCardActionProps {
  rules: TargetingRule[];
  onRuleOrderChange: (newRules: TargetingRule[]) => void;
}

const SortableItem = ({
  rule,
  variations,
  isEditable,
  isDeletingRule,
  onEdit,
  onDelete,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: rule.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <FlagRuleCard
        dragHandleProps={{ ...attributes, ...listeners }}
        isDeleting={isDeletingRule}
        isEditable={isEditable}
        onDelete={onDelete}
        onEdit={onEdit}
        rule={rule}
        variations={variations}
      />
    </div>
  );
};

export const SortableRuleList = ({
  rules,
  onRuleOrderChange,
  ...cardProps
}: SortableRuleListProps) => {
  const validRules = rules.filter((r): r is TargetingRule & { id: string } =>
    Boolean(r.id)
  );
  const ruleIds = validRules.map((r) => r.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const activeIndex = ruleIds.indexOf(active.id as string);
      const overIndex = ruleIds.indexOf(over?.id as string);

      if (activeIndex !== -1 && overIndex !== -1) {
        const newRules = arrayMove(rules, activeIndex, overIndex);
        onRuleOrderChange(newRules);
      }
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ruleIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {validRules.map((rule) => (
            <SortableItem key={rule.id} rule={rule} {...cardProps} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
