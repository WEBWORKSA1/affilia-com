/* Affilia.com site settings. Edit values here; no other file needs changing.

   FORMS: every form posts to FormSubmit (free). The very first submission sends a one-time
   activation email to the owner's inbox. Click the activation link once, and all forms start
   delivering. FormSubmit then emails you a random alias string; paste it into formAlias below
   so the inbox address is never used in requests again.

   The inbox address is stored encoded below and is never printed on any page. */
window.AFFILIA_CONFIG = {
  formAlias: '',
  inbox: ['=02bj5Cbp', 'FWbnBUMhN3', 'ay92diV2d'],

  /* Donations: paste a payment link to switch on instant payments (leave '' to keep pledge mode).
     paypal: a PayPal hosted donate-button URL, e.g. https://www.paypal.com/donate/?hosted_button_id=XXXX
     stripe: a Stripe Payment Link, e.g. https://buy.stripe.com/XXXX
     kofi / bmc: your Ko-fi or Buy Me a Coffee page URL */
  donate: { paypal: '', stripe: '', kofi: '', bmc: '' },

  /* Optional manual AdSense units. Auto ads already run on every page.
     Create display units in AdSense and paste their numeric slot IDs to add fixed placements. */
  adSlots: { inArticle: '', sidebar: '', directory: '' }
};
