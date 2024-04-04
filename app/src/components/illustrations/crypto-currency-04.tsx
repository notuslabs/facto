export function CryptoCurrency04(props: React.HTMLAttributes<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={80} height={81} fill="none" {...props}>
      <path
        stroke="url(#borrower-gradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={6.756}
        d="m6.667 7.167 6.666 6.666m60-6.666-6.666 6.666m6.666 60-6.666-6.666m-60 6.666 6.666-6.666M6.667 53.833h5m15-46.666v5m46.666 15h-5m-15 46.666v-5m6.667-15h11.667M53.333 7.167V20.5M6.667 27.167H20m6.667 46.666V60.5m11.447-34.781L25.22 38.614c-.66.66-.99.99-1.114 1.371a1.667 1.667 0 0 0 0 1.03c.124.38.454.71 1.114 1.37l12.895 12.896c.66.66.99.99 1.371 1.114.335.108.695.108 1.03 0 .38-.124.71-.454 1.37-1.114l12.896-12.895c.66-.66.99-.99 1.114-1.371a1.666 1.666 0 0 0 0-1.03c-.124-.38-.454-.71-1.114-1.37L41.886 25.718c-.66-.66-.99-.99-1.37-1.114a1.668 1.668 0 0 0-1.031 0c-.38.124-.71.454-1.37 1.114Z"
      />
      <defs>
        <linearGradient
          id="borrower-gradient"
          x1={6.667}
          x2={73.333}
          y1={40.5}
          y2={40.5}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#717270" />
          <stop offset={0.5} stopColor="#D6D8D5" />
        </linearGradient>
      </defs>
    </svg>
  );
}
