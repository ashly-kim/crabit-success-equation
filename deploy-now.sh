#!/bin/bash
# 즉시 1회 배포
cd "$(dirname "$0")"
SITE_ID="ba2c01c5-f779-499a-b8b9-fb7b707f310a"
PROXY='https://netlify-mcp.netlify.app/proxy/eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..rkMMxlwvYrrTv22g.ZdN0uO5cAYDWwAWvZdO6k5oMjSyZyBni5IsdTJUQcffBu0Zqvbv_XTaWUvmBpX2ttKQdyi7xuWp4wSVqikhehW5_A2ZfBZV7xu16aY4TiZUsLU4C1U4b080v2yyexuIcZL22lyd1-mx3QakaK0T4tKpmr6v3oYeXzPaOb3EGlzDqto0RE7budiinBy9EIgNLmnRmlRxH9R_PhUdUEiC-RXpJk3yQ4zscFWauJaiy-EuPL2GHyfDAzhdY-RDxVjqIhk3DztzRgnGFQ_1kkRNHdTNrxQB1CrWLkIzlpJRE_d93_LmDjeNzU-egrvA4IQe70YXGmzxfq65hOF8HvvfGgacyvc7KScj1kiRtX9QIWP2nE7yPng.OkAbmCpMs9DIIcY5lBRoVA'
echo "🚀 배포 중..."
npx -y @netlify/mcp@latest --site-id "$SITE_ID" --proxy-path "$PROXY" --no-wait
echo "✅ https://crabit-success-equation.netlify.app"
