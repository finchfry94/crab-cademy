<script setup lang="ts">
import { useRouter } from "vue-router";
import { ArrowLeft, BookOpen, CheckCircle, Code, Play, Terminal, HelpCircle, GraduationCap, Shield, Server, Laptop, Smartphone } from "lucide-vue-next";

const router = useRouter();


function goBack() {
  router.push({ name: "landing" });
}

const steps = [
  {
    title: "Choose a Path",
    description: "Start by selecting a learning path that fits your goals. From 'The Rust Book' to specialized topics.",
    icon: GraduationCap,
    color: "from-blue-500 to-indigo-500",
  },
  {
    title: "Run Real Code",
    description: "Every lesson includes an interactive code editor. Write Rust, run it, and see output instantly.",
    icon: Terminal,
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Master Concepts",
    description: "Complete quizzes and challenges to verify your understanding and earn badges.",
    icon: CheckCircle,
    color: "from-emerald-500 to-green-500",
  },
];
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-white font-sans selection:bg-orange-500/30">
    <!-- Header -->
    <header class="relative overflow-hidden border-b border-neutral-800/50">
      <div class="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-neutral-950 to-blue-900/10"></div>
      <div class="relative max-w-5xl mx-auto px-6 py-12">
        <button
          @click="goBack"
          class="absolute left-6 top-6 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-orange-400 bg-neutral-900/80 hover:bg-neutral-800 rounded-lg border border-neutral-800 hover:border-orange-500/40 transition-all duration-200"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          Back
        </button>

        <div class="text-center mt-8">
          <div class="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20 shadow-xl shadow-orange-500/10">
            <HelpCircle class="w-8 h-8 text-orange-400" />
          </div>
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            How <span class="bg-gradient-to-r from-orange-400 via-orange-300 to-red-400 bg-clip-text text-transparent">CrabCademy</span> Works
          </h1>
          <p class="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Your interactive playground for mastering Rust. Learn by doing, with zero setup required.
          </p>
        </div>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-12 space-y-24">
      
      <!-- Feature Steps -->
      <section class="grid md:grid-cols-3 gap-8">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="relative group p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:bg-neutral-900/60 transition-all duration-300"
        >
          <div class="absolute -top-6 left-6 w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
             <component :is="step.icon" class="w-6 h-6 text-neutral-300" />
          </div>
          <div class="mt-8">
            <h3 class="text-xl font-bold text-neutral-200 mb-2">{{ step.title }}</h3>
            <p class="text-neutral-400 leading-relaxed text-sm">{{ step.description }}</p>
          </div>
          <div :class="['absolute inset-x-0 bottom-0 h-1 rounded-b-2xl bg-gradient-to-r opacity-50 group-hover:opacity-100 transition-opacity', step.color]"></div>
        </div>
      </section>

      <!-- Interactive Demo Section -->
      <section class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <Code class="w-3.5 h-3.5" />
            Live Editor
          </div>
          <h2 class="text-3xl font-bold text-white">Write Code, Not Setup Scripts</h2>
          <p class="text-neutral-400 text-lg leading-relaxed">
            Forget about toolchains and configurations. Our browser-based editor lets you write and execute Rust code instantly. 
            <br/><br/>
            Need more power? Our desktop app unlocks full system access for advanced file I/O operations.
          </p>
          
          <ul class="space-y-3 mt-4">
             <li class="flex items-center gap-3 text-neutral-300">
               <CheckCircle class="w-5 h-5 text-emerald-400" />
               <span>Instant compilation feedback</span>
             </li>
             <li class="flex items-center gap-3 text-neutral-300">
               <CheckCircle class="w-5 h-5 text-emerald-400" />
               <span>Standard library support</span>
             </li>
             <li class="flex items-center gap-3 text-neutral-300">
               <CheckCircle class="w-5 h-5 text-emerald-400" />
               <span>Switch between Browser & Desktop modes</span>
             </li>
          </ul>
        </div>

        <!-- Mock Editor -->
        <div class="relative rounded-xl overflow-hidden bg-[#1e1e1e] border border-neutral-700 shadow-2xl shadow-black/50 ring-1 ring-white/10">
           <!-- Window Controls -->
           <div class="flex items-center gap-2 px-4 py-3 bg-[#252526] border-b border-neutral-700">
             <div class="flex gap-1.5">
               <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
               <div class="w-3 h-3 rounded-full bg-amber-500/80"></div>
               <div class="w-3 h-3 rounded-full bg-emerald-500/80"></div>
             </div>
             <span class="ml-4 text-xs text-neutral-500 font-mono">main.rs</span>
           </div>
           
           <!-- Code Area -->
           <div class="p-4 font-mono text-sm leading-relaxed overflow-x-auto">
             <div class="text-pink-400">fn <span class="text-blue-400">main</span>() {</div>
             <div class="pl-4">
               <span class="text-neutral-400">// This is editable!</span>
             </div>
             <div class="pl-4">
               <span class="text-blue-400">println!</span>(<span class="text-orange-300">"Hello, CrabCademy!"</span>);
             </div>
             <div class="text-pink-400">}</div>
           </div>

           <!-- Terminal Output Mock -->
           <div class="border-t border-neutral-700 bg-[#1e1e1e] p-4 font-mono text-xs">
             <div class="flex items-center justify-between mb-2">
                <span class="text-neutral-500 uppercase tracking-widest font-bold text-[10px]">Terminal</span>
                <span class="text-emerald-400 text-[10px]">● Ready</span>
             </div>
             <div class="text-neutral-300">$ cargo run</div>
             <div class="text-neutral-400 mt-1">   Compiling playground v0.1.0 (/playground)</div>
             <div class="text-neutral-400">    Finished dev [unoptimized + debuginfo] target(s) in 0.52s</div>
             <div class="text-neutral-400">     Running `target/debug/playground`</div>
             <div class="text-white mt-1 font-bold">Hello, CrabCademy!</div>
           </div>

           <!-- Floating Action Button Mock -->
           <div class="absolute top-16 right-4">
             <div class="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20 text-white animate-pulse">
               <Play class="w-4 h-4 fill-current" />
             </div>
           </div>
        </div>
      </section>

      <!-- Completing Lessons Section -->
      <section class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Mock Success State -->
        <div class="order-2 lg:order-1 relative rounded-xl overflow-hidden bg-[#1e1e1e] border border-neutral-700 shadow-2xl shadow-black/50 p-8 flex flex-col items-center justify-center text-center space-y-6">
           <div class="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
             <CheckCircle class="w-10 h-10 text-emerald-500" />
           </div>
           <div>
             <h3 class="text-2xl font-bold text-white mb-2">Lesson Completed!</h3>
             <p class="text-neutral-400">Great job! You've mastered this concept.</p>
           </div>
           <div class="flex gap-3">
             <button class="px-4 py-2 bg-neutral-800 text-neutral-400 rounded-lg text-sm font-medium">Review Code</button>
             <button class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-900/20">Next Lesson</button>
           </div>

           <!-- Decoration -->
           <div class="absolute inset-0 bg-gradient-to-t from-emerald-900/10 to-transparent pointer-events-none"></div>
        </div>

        <div class="order-1 lg:order-2 space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <CheckCircle class="w-3.5 h-3.5" />
            Progression
          </div>
          <h2 class="text-3xl font-bold text-white">Track Your Progress</h2>
          <p class="text-neutral-400 text-lg leading-relaxed">
            As you complete lessons and pass tests, you'll earn badges and track your journey through the Rust landscape.
          </p>
          
          <ul class="space-y-4 mt-4">
             <li class="flex gap-4">
               <div class="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                 <span class="font-bold text-neutral-400">1</span>
               </div>
               <div>
                 <h4 class="text-white font-semibold mb-1">Pass the Tests</h4>
                 <p class="text-sm text-neutral-400">Run your code against our test suite. When everything turns green, you're ready to move on.</p>
               </div>
             </li>
             <li class="flex gap-4">
               <div class="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                 <span class="font-bold text-neutral-400">2</span>
               </div>
               <div>
                 <h4 class="text-white font-semibold mb-1">Earn Badges</h4>
                 <p class="text-sm text-neutral-400">Collect completion badges for every lesson and chapter you conquer.</p>
               </div>
             </li>
          </ul>
        </div>
      </section>

      <!-- Feedback Section -->
      <section class="relative overflow-hidden rounded-3xl bg-neutral-900/30 border border-neutral-800 p-8 md:p-12">
        <div class="absolute top-0 right-0 p-12 opacity-5">
          <HelpCircle class="w-64 h-64" />
        </div>
        
        <div class="relative z-10 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <HelpCircle class="w-3.5 h-3.5" />
            Community & Support
          </div>
          <h2 class="text-3xl font-bold text-white mb-4">Help Us Improve</h2>
          <p class="text-neutral-400 text-lg leading-relaxed mb-8">
            Spot a typo? Confused by an explanation? We want to hear from you. 
            Highlight any text in a lesson to suggest an edit, or use the feedback button to send us your thoughts directly.
          </p>

          <div class="grid sm:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-3">
              <div class="mt-1">
                <div class="w-2 h-2 rounded-full bg-orange-500"></div>
              </div>
              <div>
                <h4 class="text-white font-medium text-sm">Contextual Feedback</h4>
                <p class="text-xs text-neutral-500 mt-1">Select text to report specific issues right where they happen.</p>
              </div>
            </div>
            <div class="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-3">
              <div class="mt-1">
                <div class="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
              <div>
                <h4 class="text-white font-medium text-sm">GitHub Integration</h4>
                <p class="text-xs text-neutral-500 mt-1">Issues are automatically tracked on our GitHub repository.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Under the Hood Section -->
      <section class="space-y-6">
          <div class="text-center mb-12">
             <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Shield class="w-3.5 h-3.5" />
              Privacy & Execution
            </div>
            <h2 class="text-3xl font-bold text-white">How Your Code Runs</h2>
          </div>

          <div class="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <!-- Browser Mode -->
            <div class="relative group p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:bg-neutral-900/60 transition-all duration-300">
               <div class="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mb-6">
                 <Server class="w-6 h-6 text-neutral-400 group-hover:text-purple-400 transition-colors" />
               </div>
               <h3 class="text-xl font-bold text-white mb-2">Browser Mode</h3>
               <p class="text-neutral-400 leading-relaxed mb-4">
                 When using the web app, your code is securely sent to the official 
                 <a href="https://play.rust-lang.org/" target="_blank" class="text-purple-400 hover:text-purple-300 underline">Rust Playground</a> 
                 service for compilation and execution.
               </p>
               <ul class="space-y-2 text-sm text-neutral-500">
                 <li class="flex items-center gap-2">
                   <CheckCircle class="w-4 h-4 text-emerald-500/50" />
                   No installation required
                 </li>
                 <li class="flex items-center gap-2">
                   <CheckCircle class="w-4 h-4 text-emerald-500/50" />
                   Official stable Rust
                 </li>
               </ul>
            </div>

            <!-- Desktop Mode -->
            <div class="relative group p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:bg-neutral-900/60 transition-all duration-300">
               <div class="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mb-6">
                 <Laptop class="w-6 h-6 text-neutral-400 group-hover:text-emerald-400 transition-colors" />
               </div>
               <h3 class="text-xl font-bold text-white mb-2">Desktop Mode</h3>
               <p class="text-neutral-400 leading-relaxed mb-4">
                 When running the downloadable app, CrabCademy uses <span class="text-emerald-400 font-medium">Tauri</span> to run code directly on your machine.
               </p>
               
               <div class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex gap-3">
                 <Shield class="w-5 h-5 text-red-400 shrink-0" />
                 <div class="text-sm text-red-200">
                   <span class="font-bold block text-red-400 mb-0.5">Full System Access</span>
                   Your code runs with <span class="font-bold text-white">your user privileges</span>. You can read/write files, spawn processes, or even delete data. Use with caution!
                 </div>
               </div>

               <ul class="space-y-2 text-sm text-neutral-500">
                 <li class="flex items-center gap-2">
                   <CheckCircle class="w-4 h-4 text-emerald-500" />
                   Runs locally & offline
                 </li>
                 <li class="flex items-center gap-2">
                   <CheckCircle class="w-4 h-4 text-emerald-500" />
                   Zero data leaves your device
                 </li>
                 <li class="flex items-center gap-2">
                   <CheckCircle class="w-4 h-4 text-emerald-500" />
                   Full system file I/O access
                 </li>
               </ul>
            </div>

            <!-- Mobile Mode -->
            <div class="relative group p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:bg-neutral-900/60 transition-all duration-300">
               <div class="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mb-6">
                 <Smartphone class="w-6 h-6 text-neutral-400 group-hover:text-blue-400 transition-colors" />
               </div>
               <h3 class="text-xl font-bold text-white mb-2">Mobile Mode</h3>
               <p class="text-neutral-400 leading-relaxed mb-4">
                 On smaller screens, the editor and terminal are hidden by default to provide a focused reading experience.
               </p>
               <ul class="space-y-2 text-sm text-neutral-500">
                 <li class="flex items-center gap-2">
                   <CheckCircle class="w-4 h-4 text-emerald-500/50" />
                   Distraction-free reading
                 </li>
                 <li class="flex items-center gap-2">
                   <CheckCircle class="w-4 h-4 text-emerald-500/50" />
                   Optimized for touch
                 </li>
                 <li class="flex items-center gap-2">
                   <CheckCircle class="w-4 h-4 text-emerald-500/50" />
                   Perfect for on-the-go study
                 </li>
               </ul>
            </div>
          </div>
      </section>

      <!-- Learning Path Preview -->
      <section class="bg-neutral-900/30 rounded-3xl border border-neutral-800 p-8 md:p-12 text-center">
        <h2 class="text-3xl font-bold mb-4">Ready to start your journey?</h2>
        <p class="text-neutral-400 max-w-xl mx-auto mb-8">
          Choose a path below to begin. Whether you're new to programming or an experienced dev, we have a path for you.
        </p>
        
        <button 
          @click="goBack"
          class="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-500/20"
        >
          <BookOpen class="w-5 h-5" />
          Explore Learning Paths
        </button>
      </section>

    </main>
  </div>
</template>
