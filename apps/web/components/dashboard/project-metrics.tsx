export const ProjectMetrics = () => (
  <div className="w-full border-b bg-[#F4F4F5]">
    <div className="container-wrapper px-6 py-6">
      <div className="mb-6 flex items-center">
        <span className="font-normal text-gray-500">
          Gradual rollouts, A/B testing, and targeting rules
        </span>
      </div>

      <div className="flex w-full items-start gap-4">
        <div className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <div className="font-medium text-gray-500 text-sm uppercase">
            FLAGS
          </div>
          <div className="mt-1 font-semibold text-gray-900 text-medium opacity-90">
            13
          </div>
        </div>
        <div className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <div className="font-medium text-gray-500 text-sm uppercase">
            ENVIRONMENTS
          </div>
          <div className="mt-1 font-semibold text-gray-900 text-medium opacity-90">
            6
          </div>
        </div>
        <div className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <div className="font-medium text-gray-500 text-sm uppercase">
            EVALUATIONS
          </div>
          <div className="mt-1 font-semibold text-gray-900 text-medium opacity-90">
            8
          </div>
        </div>
      </div>
    </div>
  </div>
);
