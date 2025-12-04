import Link from "next/link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-black/5 border-t bg-[#F4F4F5] pt-16 pb-12">
      <div className="container-landing">
        <div className="flex items-start justify-between gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-xl">Flagix</h3>
            <p className="mt-2 text-sm">Feature Flags for modern teams.</p>
          </div>

          <div className="text-sm">
            <h4 className="mb-3 font-semibold">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link className="e transition-colors" href="#features">
                  Features
                </Link>
              </li>
              <li>
                <Link className="e transition-colors" href="#demo">
                  Demo
                </Link>
              </li>
              <li>
                <Link className="e transition-colors" href="#">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <h4 className="mb-3 font-semibold">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link className="e transition-colors" href="#">
                  About Us
                </Link>
              </li>

              <li>
                <Link className="e transition-colors" href="#">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="hidden text-sm lg:block">
            <h4 className="mb-3 font-semibold">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link className="e transition-colors" href="#">
                  Docs
                </Link>
              </li>
              <li>
                <Link className="e transition-colors" href="#">
                  Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-white/5 border-t pt-8 text-center">
          <p className="/50 text-sm">
            &copy; {currentYear} Flagix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
