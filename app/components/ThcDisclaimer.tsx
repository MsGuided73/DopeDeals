/**
 * Legal disclaimer block shown on PDPs of consumable products and in the
 * checkout footer when a consumable is in the cart. Copy provided by
 * compliance (Dana). Do not edit the body without compliance sign-off.
 */
export default function ThcDisclaimer({ className = '' }: { className?: string }) {
  return (
    <aside
      className={`rounded-lg border border-amber-300 bg-amber-50 px-5 py-4 text-amber-900 ${className}`}
      aria-label="THC Disclaimer"
    >
      <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
        THC Disclaimer
      </h3>
      <p className="text-xs leading-relaxed text-amber-900 sm:text-sm">
        PRODUCTS ON THIS SITE CONTAIN NO MORE THAN 0.3% DELTA 9-THC. THESE STATEMENTS HAVE
        NOT BEEN EVALUATED BY THE FOOD AND DRUG ADMINISTRATION. THIS PRODUCT IS NOT INTENDED
        TO DIAGNOSE, TREAT, CURE, OR PREVENT ANY DISEASE. THE DELTA-9 THC CONTAINED IN THIS
        PRODUCT DOES NOT EXCEED 0.3% ON A DRY WEIGHT BASIS. DO NOT USE IF YOU ARE PREGNANT,
        NURSING, SUFFERING FROM ANY MEDICAL CONDITION(S), OR ON MEDICATION. CONSULT YOUR
        HEALTHCARE PROVIDER BEFORE TAKING. KEEP OUT OF REACH OF CHILDREN AND ANIMALS. THIS
        PRODUCT MAY IMPAIR YOUR ABILITY TO DRIVE OR OPERATE MACHINERY.
      </p>
    </aside>
  );
}
