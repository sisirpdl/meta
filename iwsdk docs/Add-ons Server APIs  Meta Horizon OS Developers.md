Updated: Apr 15, 2025

## S2S REST requests

Our S2S REST APIs are available as a secure channel to interact with the Meta Horizon platform. For example, you may wish to track and consume coins purchased through in-app purchases on your trusted server. This prevents any client-side tampering to grant unpurchased gems. Using the S2S APIs are not required, but may be used if you wish.

### Verify item ownership

Verify that a user owns an item.

#### Request method/URI:

```
<span>POST https</span><span>:</span><span>//graph.oculus.com/$APP_ID/verify_entitlement</span>
```

#### Parameters

| Parameter | Required or Optional | Description | Type | Example |
| --- | --- | --- | --- | --- |
| 
access\_token

 | 

Required

 | 

Bearer token that contains OC|$APP\_ID |$APP\_SECRET or the User Access Token

 | 

string

 | 

“OC|1234|456789”

 |
| 

sku

 | 

Optional

 | 

The SKU for the add-on item, defined when created on the Developer Dashboard. If not included, this call will verify entitlement of the [base application](https://developers.meta.com/horizon/documentation/web/ps-entitlement-check/#server-apis).

 | 

string

 | 

“50\_gems”

 |
| 

user\_id

 | 

Required

 | 

The user id of the user who you want to see the purchases of

 | 

string

 | 

“123456789”

 |

Example Request

```
<span>curl </span><span>-</span><span>d </span><span>"access_token=OC|$APP_ID|$APP_SECRET"</span><span> </span><span>-</span><span>d </span><span>"user_id=$USER_ID"</span><span> </span><span>-</span><span>d </span><span>"sku=$SKU"</span><span> https</span><span>:</span><span>//graph.oculus.com/$APP_ID/verify_entitlement</span>
```

Example Response

```
<span>{</span><span>"success"</span><span>:</span><span>true</span><span>,</span><span>"grant_time"</span><span>:</span><span>1744148687</span><span>}</span>
```

#### Values

| Field | Definition | Type |
| --- | --- | --- |
| 
success

 | 

Defines whether or not the user has ownership of an item.

 | 

bool

 |
| 

grant\_time

 | 

Time when the user gained entitlement to the item (Unix timestamp).

 | 

number

 |

### Consume an IAP item

Consume an IAP item that a user has purchased. When a user purchases a consumable IAP item, the app needs to acknowledge the purchase by calling the consume API.

#### Request method/URI:

```
<span>POST https</span><span>:</span><span>//graph.oculus.com/$APP_ID/consume_entitlement</span>
```

#### Parameters

| Parameter | Required or Optional | Description | Type | Example |
| --- | --- | --- | --- | --- |
| 
access\_token

 | 

Required

 | 

Bearer token that contains OC|$APP\_ID |$APP\_SECRET or the User Access Token

 | 

string

 | 

“OC|1234|456789”

 |
| 

sku

 | 

The sku for the item, defined when created on the Developer Dashboard.

 | 

string

 | 

“50\_gems”

 |  |
| 

user\_id

 | 

Required

 | 

The user id of the user who you want to see the purchases of

 | 

string

 | 

“123456789”

 |

Example Request

```
<span>curl </span><span>-</span><span>d </span><span>"access_token=OC|$APP_ID|$APP_SECRET"</span><span> </span><span>-</span><span>d </span><span>"user_id=$USER_ID"</span><span> </span><span>-</span><span>d </span><span>"sku=$SKU"</span><span> https</span><span>:</span><span>//graph.oculus.com/$APP_ID/consume_entitlement</span>
```

Example Response

#### Values

| Field | Definition | Type |
| --- | --- | --- |
| 
success

 | 

Defines whether or not consume entitlement was successful.

 | 

bool

 |

### Retrieve items owned

Retrieve a list of items that the user owns. The results support [cursor-based pagination](https://developers.facebook.com/docs/graph-api/results), so be sure to retrieve the entire list.

#### Request method/URI:

```
<span>GET https</span><span>:</span><span>//graph.oculus.com/$APP_ID/viewer_purchases</span><span>
</span>
```

#### Parameters

| Parameter | Required or Optional | Description | Type | Example |
| --- | --- | --- | --- | --- |
| 
access\_token

 | 

Required

 | 

Bearer token that contains OC|$APP\_ID |$APP\_SECRET or the User Access Token

 | 

string

 | 

“OC|1234|456789”

 |
| 

user\_id

 | 

Required

 | 

The user id of the user who you want to see the purchases of

 | 

string

 | 

“123456789”

 |
| 

fields

 | 

Optional

 | 

A comma-separated list of field names. Can contain: id, grant\_time, expiration\_item, item.

 | 

comma-separated string

 | 

“fields=id,grant\_time,expiration\_time,item{sku}”

 |

Example Request

```
<span>curl </span><span>-</span><span>G </span><span>-</span><span>d </span><span>"access_token=OC|$APP_ID|$APP_SECRET"</span><span> </span><span>-</span><span>d </span><span>"user_id=$USER_ID"</span><span> </span><span>-</span><span>d </span><span>"fields=id,grant_time,expiration_time,item{sku}"</span><span> https</span><span>:</span><span>//graph.oculus.com/$APP_ID/viewer_purchases</span>
```

Example Response

```
<span>{</span><span>
  </span><span>"data"</span><span>:</span><span> </span><span>[</span><span>
    </span><span>{</span><span>
      </span><span>"id"</span><span>:</span><span>"0"</span><span>,</span><span>
      </span><span>"grant_time"</span><span>:</span><span>1626821865</span><span>,</span><span>
      </span><span>"expiration_time"</span><span>:</span><span>0</span><span>,</span><span>
      </span><span>"item"</span><span>:</span><span> </span><span>{</span><span>
        </span><span>"sku"</span><span>:</span><span>"EXAMPLE1"</span><span>,</span><span>
        </span><span>"id"</span><span>:</span><span>"3911516768971206"</span><span>
      </span><span>}</span><span>
    </span><span>}</span><span>
  </span><span>],</span><span>
  </span><span>"paging"</span><span>:</span><span> </span><span>{</span><span>
    </span><span>"cursors"</span><span>:</span><span> </span><span>{</span><span>
      </span><span>"after"</span><span>:</span><span> </span><span>"QYFIUjlhQjNhOTJZAR0ZAaMkhhM1JKZADdNX2o0a2FSSlJLSWcw"</span><span>,</span><span>
      </span><span>"before"</span><span>:</span><span> </span><span>"QYFIUkZAxd2FRSkNoWHJQV3FmRG5TY3BDeUgwRzFaMXd"</span><span>
    </span><span>},</span><span>
    </span><span>"previous"</span><span>:</span><span> </span><span>"https://graph.oculus.com/$APP_ID/viewer_purchases?access_token=..."</span><span>
    </span><span>"next"</span><span>:</span><span> </span><span>"https://graph.oculus.com/$APP_ID/viewer_purchases?access_token=..."</span><span>
  </span><span>}</span><span>
</span><span>}</span>
```

#### Values

| Field | Definition | Type |
| --- | --- | --- |
| 
id

 | 

Unique identifier.

 | 

string

 |
| 

grant\_time

 | 

Time when the user gained entitlement to the item (Unix timestamp).

 | 

number

 |
| 

expiration\_time

 | 

Time when the user will lose entitlement to the item (Unix timestamp). If the user has an indefinite entitlement it will be 0.

 | 

number

 |
| 

item.sku

 | 

The SKU of the time

 | 

string

 |

### Retrieve items available for purchase

Retrieves a list of items that are available for purchase in an application. The results support [cursor-based pagination](https://developers.facebook.com/docs/graph-api/results), so be sure to retrieve the entire list.

#### Request method/URI:

```
<span>GET https</span><span>:</span><span>//graph.oculus.com/application/available_purchases</span>
```

#### Parameters

Using the app-secret access token returns all the items that are available for purchase. Using the user access token returns returns only the items are available for purchase for that particular user.

| Parameter | Required or Optional | Description | Type | Example |
| --- | --- | --- | --- | --- |
| 
access\_token

 | 

Required

 | 

Bearer token that contains OC|$APP\_ID |$APP\_SECRET or the User Access Token

 | 

string

 | 

“OC|1234|456789”

 |
| 

fields

 | 

Optional

 | 

A comma-separated list of field names. Can contain: sku, current\_offer, billing\_plans (For subscription items).

 | 

comma-separated string

 | 

“sku,current\_offer{description,price{currency,amount\_in\_hundredths,formatted},name},billing\_plans{paid\_offer{description,price{currency,amount\_in\_hundredths,formatted},name},trial\_offers{max\_term\_count,trial\_type,trial\_term,description,name,price{currency,amount\_in\_hundredths,formatted}}}”

 |

Example Request

```
<span>curl </span><span>-</span><span>d </span><span>"access_token=OC|$APP_ID|$APP_SECRET"</span><span> </span><span>-</span><span>d </span><span>"fields=sku,current_offer{description,price{currency,amount_in_hundredths,formatted},name},billing_plans{paid_offer{description,price{currency,amount_in_hundredths,formatted},name},trial_offers{max_term_count,trial_type,trial_term,description,name,price{currency,amount_in_hundredths,formatted}}}"</span><span> </span><span>-</span><span>G https</span><span>:</span><span>//graph.oculus.com/application/available_purchases</span>
```

Example Response

```
<span>{</span><span>
  </span><span>"data"</span><span>:</span><span> </span><span>[</span><span>
    </span><span>{</span><span>
      </span><span>"id"</span><span>:</span><span> </span><span>"23518108958879017"</span><span>,</span><span>
      </span><span>"sku"</span><span>:</span><span> </span><span>"subs-bronze:SUBSCRIPTION__MONTHLY"</span><span>,</span><span>
      </span><span>"current_offer"</span><span>:</span><span> </span><span>{</span><span>
        </span><span>"description"</span><span>:</span><span> </span><span>"Subscription - Bronze Description"</span><span>,</span><span>
        </span><span>"price"</span><span>:</span><span> </span><span>{</span><span>
          </span><span>"currency"</span><span>:</span><span> </span><span>"USD"</span><span>,</span><span>
          </span><span>"amount_in_hundredths"</span><span>:</span><span> </span><span>299</span><span>,</span><span>
          </span><span>"formatted"</span><span>:</span><span> </span><span>"$2.99"</span><span>
        </span><span>},</span><span>
        </span><span>"name"</span><span>:</span><span> </span><span>"Subscription - Bronze"</span><span>,</span><span>
        </span><span>"id"</span><span>:</span><span> </span><span>"6974589902912852"</span><span>
      </span><span>},</span><span>
      </span><span>"billing_plans"</span><span>:</span><span> </span><span>[</span><span>
        </span><span>{</span><span>
          </span><span>"paid_offer"</span><span>:</span><span> </span><span>{</span><span>
            </span><span>"description"</span><span>:</span><span> </span><span>"Subscription - Bronze Description"</span><span>,</span><span>
            </span><span>"price"</span><span>:</span><span> </span><span>{</span><span>
              </span><span>"currency"</span><span>:</span><span> </span><span>"USD"</span><span>,</span><span>
              </span><span>"amount_in_hundredths"</span><span>:</span><span> </span><span>299</span><span>,</span><span>
              </span><span>"formatted"</span><span>:</span><span> </span><span>"$2.99"</span><span>
            </span><span>},</span><span>
            </span><span>"name"</span><span>:</span><span> </span><span>"Subscription - Bronze"</span><span>,</span><span>
            </span><span>"id"</span><span>:</span><span> </span><span>"2274589902912852"</span><span>
          </span><span>},</span><span>
          </span><span>"trial_offers"</span><span>:</span><span> </span><span>[</span><span>
            </span><span>{</span><span>
              </span><span>"trial_type"</span><span>:</span><span> </span><span>"FREE_TRIAL"</span><span>,</span><span>
              </span><span>"trial_term"</span><span>:</span><span> </span><span>"MONTHLY"</span><span>,</span><span>
              </span><span>"description"</span><span>:</span><span> </span><span>"Subscription - Bronze Description"</span><span>,</span><span>
              </span><span>"name"</span><span>:</span><span> </span><span>"Subscription - Bronze"</span><span>,</span><span>
              </span><span>"price"</span><span>:</span><span> </span><span>{</span><span>
                </span><span>"currency"</span><span>:</span><span> </span><span>"USD"</span><span>,</span><span>
                </span><span>"amount_in_hundredths"</span><span>:</span><span> </span><span>0</span><span>,</span><span>
                </span><span>"formatted"</span><span>:</span><span> </span><span>"$0.00"</span><span>
              </span><span>},</span><span>
              </span><span>"id"</span><span>:</span><span> </span><span>"3012763990016787"</span><span>
            </span><span>}</span><span>
          </span><span>]</span><span>
        </span><span>}</span><span>
      </span><span>]</span><span>
    </span><span>},</span><span>
    </span><span>{</span><span>
      </span><span>"id"</span><span>:</span><span> </span><span>"23518108958879017"</span><span>,</span><span>
      </span><span>"sku"</span><span>:</span><span> </span><span>"subs-bronze:SUBSCRIPTION__SEMIANNUAL"</span><span>,</span><span>
      </span><span>"current_offer"</span><span>:</span><span> </span><span>{</span><span>
        </span><span>"description"</span><span>:</span><span> </span><span>"Subscription - Bronze Description"</span><span>,</span><span>
        </span><span>"price"</span><span>:</span><span> </span><span>{</span><span>
          </span><span>"currency"</span><span>:</span><span> </span><span>"USD"</span><span>,</span><span>
          </span><span>"amount_in_hundredths"</span><span>:</span><span> </span><span>999</span><span>,</span><span>
          </span><span>"formatted"</span><span>:</span><span> </span><span>"$9.99"</span><span>
        </span><span>},</span><span>
        </span><span>"name"</span><span>:</span><span> </span><span>"Subscription - Bronze"</span><span>,</span><span>
        </span><span>"id"</span><span>:</span><span> </span><span>"1277845290061617"</span><span>
      </span><span>},</span><span>
      </span><span>"billing_plans"</span><span>:</span><span> </span><span>[</span><span>
        </span><span>{</span><span>
          </span><span>"paid_offer"</span><span>:</span><span> </span><span>{</span><span>
            </span><span>"description"</span><span>:</span><span> </span><span>"Subscription - Bronze Description"</span><span>,</span><span>
            </span><span>"price"</span><span>:</span><span> </span><span>{</span><span>
              </span><span>"currency"</span><span>:</span><span> </span><span>"USD"</span><span>,</span><span>
              </span><span>"amount_in_hundredths"</span><span>:</span><span> </span><span>999</span><span>,</span><span>
              </span><span>"formatted"</span><span>:</span><span> </span><span>"$9.99"</span><span>
            </span><span>},</span><span>
            </span><span>"name"</span><span>:</span><span> </span><span>"Subscription - Bronze"</span><span>,</span><span>
            </span><span>"id"</span><span>:</span><span> </span><span>"127784349006157"</span><span>
          </span><span>},</span><span>
          </span><span>"trial_offers"</span><span>:</span><span> </span><span>[</span><span>
            </span><span>{</span><span>
              </span><span>"trial_type"</span><span>:</span><span> </span><span>"FREE_TRIAL"</span><span>,</span><span>
              </span><span>"trial_term"</span><span>:</span><span> </span><span>"MONTHLY"</span><span>,</span><span>
              </span><span>"description"</span><span>:</span><span> </span><span>"Subscription - Bronze Description"</span><span>,</span><span>
              </span><span>"name"</span><span>:</span><span> </span><span>"Subscription - Bronze"</span><span>,</span><span>
              </span><span>"price"</span><span>:</span><span> </span><span>{</span><span>
                </span><span>"currency"</span><span>:</span><span> </span><span>"USD"</span><span>,</span><span>
                </span><span>"amount_in_hundredths"</span><span>:</span><span> </span><span>0</span><span>,</span><span>
                </span><span>"formatted"</span><span>:</span><span> </span><span>"$0.00"</span><span>
              </span><span>},</span><span>
              </span><span>"id"</span><span>:</span><span> </span><span>"121211290016787"</span><span>
            </span><span>}</span><span>
          </span><span>]</span><span>
        </span><span>}</span><span>
      </span><span>]</span><span>
    </span><span>},</span><span>
  </span><span>],</span><span>
  </span><span>"paging"</span><span>:</span><span> </span><span>{</span><span>
    </span><span>"cursors"</span><span>:</span><span> </span><span>{</span><span>
      </span><span>"after"</span><span>:</span><span> </span><span>"QYFIUjlhQjNhOTJZAR0ZAaMkhhM1JKZADdNX2o0a2FSSlJLSWcw"</span><span>,</span><span>
      </span><span>"before"</span><span>:</span><span> </span><span>"QYFIUkZAxd2FRSkNoWHJQV3FmRG5TY3BDeUgwRzFaMXd"</span><span>
    </span><span>}</span><span>
  </span><span>}</span><span>
</span><span>}</span>
```

#### Values

| Field | Definition | Type |
| --- | --- | --- |
| 
id

 | 

Unique identifier.

 | 

string

 |
| 

sku

 | 

The SKU of the item. Subscription items which have multiple terms will return as separate objects in the response as displayed in the example with the form {SKU}:SUBSCRIPTION\_\_{TERM}.

 | 

string

 |
| 

current\_offer

 | 

The current best paid or intro offer by price.

 | 

CurrentOffer

 |
| 

billing\_plans

 | 

An array representing the billing plans of the subscription item. The billing plans includes information about the paid offer, intro offers, and trial offers. **NOTE: Only Applicable to Subscription Items.**

 | 

Array\[BillingPlan\]

 |

#### BillingPlan

| Field | Definition | Type |
| --- | --- | --- |
| 
trial\_offers

 | 

The trial offers associated with the subscription term: Free Trial or Intro Offer.

 | 

Array\[TrialOffer\]

 |
| 

paid\_offer

 | 

The paid offer associated with the subscription term.

 | 

PaidOffer

 |

#### CurrentOffer

| Field | Definition | Type |
| --- | --- | --- |
| 
description

 | 

The description of the offer.

 | 

string

 |
| 

name

 | 

The name of the offer.

 | 

string

 |
| 

price

 | 

The price details associated with the offer.

 | 

Price

 |

#### PaidOffer

| Field | Definition | Type |
| --- | --- | --- |
| 
subscription\_term

 | 

The term of the subscription (e.g.: MONTHLY, ANNUAL, WEEKLY, BIWEEKLY, QUARTERLY, SEMIANNUAL).

 | 

string

 |
| 

description

 | 

The description of the offer.

 | 

string

 |
| 

name

 | 

The name of the offer.

 | 

string

 |
| 

price

 | 

The price of the offer.

 | 

Price

 |

#### TrialOffer

| Field | Definition | Type |
| --- | --- | --- |
| 
trial\_term

 | 

The term of the subscription (e.g.: MONTHLY, ANNUAL, WEEKLY, BIWEEKLY, QUARTERLY, SEMIANNUAL).

 | 

string

 |
| 

trial\_type

 | 

The type of the trial (e.g.: FREE\_TRIAL, INTRO\_OFFER ).

 | 

string

 |
| 

max\_term\_count

 | 

The number of terms the intro\_offer will last. Only set for intro offers.

 | 

int

 |
| 

description

 | 

The description of the offer.

 | 

string

 |
| 

name

 | 

The name of the offer.

 | 

string

 |
| 

price

 | 

The price of the offer.

 | 

Price

 |

#### Price

| Field | Definition | Type |
| --- | --- | --- |
| 
currency

 | 

The currency of the price (e.g.: USD, EUR).

 | 

string

 |
| 

amount\_in\_hundredths

 | 

The amount of the price in hundredths. For example a price of 11.99 is represented as 1199.

 | 

number

 |
| 

formatted

 | 

The formatted price (e.g.: $11.99).

 | 

string

 |

### Refund an IAP item

Refund an IAP item or bundle that a user has purchased. Can be only called to refund DURABLE or CONSUMABLE entitlements that have not been consumed yet

#### Request method/URI:

```
<span>POST https</span><span>:</span><span>//graph.oculus.com/$APP_ID/refund_iap_entitlement</span>
```

#### Parameters

| Parameter | Required or Optional | Description | Type | Example |
| --- | --- | --- | --- | --- |
| 
access\_token

 | 

Required

 | 

Bearer token that contains OC|$APP\_ID |$APP\_SECRET or the User Access Token

 | 

string

 | 

“OC|1234|456789”

 |
| 

sku

 | 

Required

 | 

The sku for the item, defined when created on the Developer Dashboard.

 | 

string

 | 

“50\_gems”

 |
| 

user\_id

 | 

Required

 | 

The user id of the user who you want to see the purchases of

 | 

string

 | 

“123456789”

 |
| 

reason

 | 

Required

 | 

The reason for the refund (e.g.: customer\_support, unable\_to\_fulfill, other)

 | 

string

 | 

“customer\_support”

 |

Example Request

```
<span>curl </span><span>-</span><span>d </span><span>"access_token=OC|$APP_ID|$APP_SECRET"</span><span> </span><span>-</span><span>d </span><span>"user_id=$USER_ID"</span><span> </span><span>-</span><span>d </span><span>"sku=$SKU"</span><span> </span><span>-</span><span>d </span><span>"reason=$REASON"</span><span> https</span><span>:</span><span>//graph.oculus.com/$APP_ID/refund_iap_entitlement</span>
```

Example Response

#### Values

| Field | Definition | Type |
| --- | --- | --- |
| 
success

 | 

Defines whether or not refund iap entitlement was successful.

 | 

bool

 |