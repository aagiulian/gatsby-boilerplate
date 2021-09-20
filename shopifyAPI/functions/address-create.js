mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
	customerAddressCreate(
	  customerAccessToken: $customerAccessToken
	  address: $address
	) {
	  customerAddress {
	    id
	  }
	  customerUserErrors {
	    code
	    field
	    message
	  }
	}
      }

{
	"customerAccessToken": "ae0f1d2e179c9571122a0595a6ac8125",
	"address": {}
}