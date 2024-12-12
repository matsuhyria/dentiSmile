import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getAvailableReasons, Reason } from '@/lib/reasonStore';

interface ReasonSelectionProps {
    isActive: boolean;
    onSelect: (reasonId: string) => void;
    selectedReason: string;
    onEdit: () => void;
}

const ReasonSelection = ({
    isActive,
    onSelect,
    selectedReason,
    onEdit
}: ReasonSelectionProps) => {
    const reasons: Reason[] = getAvailableReasons();

    if (!isActive && !selectedReason) return null;

    return (
        <div
            className={`border p-4 ${
                isActive ? 'rounded-b-lg' : 'border-b-0 py-2'
            }`}
        >
            {isActive ? (
                <>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                            Reason for Visit
                        </h3>
                    </div>
                    <RadioGroup
                        className="mt-4 space-y-2"
                        onValueChange={onSelect}
                        value={selectedReason}
                    >
                        {reasons.map((reason) => (
                            <div
                                key={reason.id}
                                className="flex items-center space-x-2"
                            >
                                <RadioGroupItem
                                    value={reason.id}
                                    id={reason.id}
                                />
                                <Label
                                    className="cursor-pointer"
                                    htmlFor={reason.id}
                                >
                                    {reason.name}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </>
            ) : (
                selectedReason && (
                    <div className="flex justify-between items-center text-gray-600 text-sm">
                        <p>
                            {reasons.find((r) => r.id === selectedReason)?.name}
                        </p>
                        <Button variant="ghost" onClick={onEdit}>
                            Edit
                        </Button>
                    </div>
                )
            )}
        </div>
    );
};

export default ReasonSelection;
