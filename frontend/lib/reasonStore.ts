export interface Reason {
    id: string;
    name: string;
    duration: number; // Duration in minutes
}

let reasons: Reason[] = [
    { id: 'cleaning', name: 'Teeth Cleaning', duration: 45 },
    { id: 'checkup', name: 'Regular Checkup', duration: 30 },
    { id: 'filling', name: 'Cavity Filling', duration: 60 },
    { id: 'pain', name: 'Tooth Pain', duration: 40 },
    { id: 'cosmetic', name: 'Cosmetic Consultation', duration: 60 }
];

// Return current reasons
export function getAvailableReasons(): Reason[] {
    return reasons;
}

// Update reasons from external source
export function updateReasons(newReasons: Reason[]) {
    reasons = newReasons;
}
