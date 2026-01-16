import React from 'react'

export default function ShareNotes() {
	return (
		<div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-50 transition-colors duration-200 min-h-screen">
			<header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-10 py-3 shadow-sm">
				<div className="flex items-center gap-4 md:gap-8">
					<div className="flex items-center gap-4 text-slate-900 dark:text-slate-50">
						<div className="size-8 text-primary">
							<span className="material-symbols-outlined !text-[32px]">menu_book</span>
						</div>
						<h2 className="text-slate-900 dark:text-slate-50 text-xl font-bold leading-tight tracking-[-0.015em]">StudyNotes</h2>
					</div>
					<div className="hidden md:flex items-center gap-6 lg:gap-9">
						<a className="text-slate-600 dark:text-slate-300 hover:text-primary text-sm font-medium leading-normal transition-colors" href="#">Dashboard</a>
						<a className="text-primary text-sm font-medium leading-normal" href="#">My Notes</a>
						<a className="text-slate-600 dark:text-slate-300 hover:text-primary text-sm font-medium leading-normal transition-colors" href="#">Seminars</a>
						<a className="text-slate-600 dark:text-slate-300 hover:text-primary text-sm font-medium leading-normal transition-colors" href="#">Profile</a>
					</div>
				</div>
				<div className="flex flex-1 justify-end gap-4 md:gap-8">
					<label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
						<div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden">
							<div className="text-slate-400 flex items-center justify-center pl-4 bg-transparent">
								<span className="material-symbols-outlined text-[20px]">search</span>
							</div>
							<input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-slate-900 dark:text-slate-50 focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-slate-400 px-3 text-sm font-normal leading-normal" placeholder="Search notes..." defaultValue="" />
						</div>
					</label>
					<div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-slate-200 dark:border-slate-700 cursor-pointer hover:opacity-80 transition-opacity" data-alt="User profile picture showing a smiling student" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBVhZ7j02k9k8eLDdOTW--wxNazOsfDwPly7C4VbneUAEmZbb8MbIkzFUtFBU0Oq_g3FN-6x8LGcBK41xm3gFOZpltdQ7S-4bHDOK29imeuDL_7uDayW57kbuVaCR6zRZBcIGHF8EHpmEjt4v502rObIz9ISmgN1tiKUbXGrob2W4X9q8iWxPQeymwbNIIIoy1cTqnw8axzRXqs2IRpD-EMgQ1JZHz7o7PEjZi7zbmrBqoUTbFJ4v_V3hu84xJJ5Z3NjVF3nV5Fp_b4")'}}></div>
				</div>
			</header>

			<main className="layout-container flex h-full grow flex-col pb-10">
				<div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-8">
					<div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
						<div className="flex flex-wrap justify-between gap-6 mb-8">
							<div className="flex flex-col gap-2">
								<h1 className="text-slate-900 dark:text-slate-50 text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Share &amp; Connect</h1>
								<p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal max-w-2xl">Collaborate with classmates in real-time and bring your external learning resources together in one place.</p>
							</div>
							<div className="flex items-center gap-3">
								<button className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
									<span className="material-symbols-outlined text-[20px]">preview</span>
									<span>Preview</span>
								</button>
								<button className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-sm transition-colors">
									<span className="material-symbols-outlined text-[20px]">save</span>
									<span>Save Changes</span>
								</button>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<div className="flex flex-col gap-6">
								<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
									<div className="p-6 border-b border-slate-100 dark:border-slate-800">
										<h3 className="text-slate-900 dark:text-slate-50 text-xl font-bold flex items-center gap-2">
											<span className="material-symbols-outlined text-primary">group_add</span>
											Sharing &amp; Permissions
										</h3>
									</div>
									<div className="p-6 flex flex-col gap-6">
										<div>
											<label className="text-slate-900 dark:text-slate-50 text-sm font-bold leading-normal pb-2 block">Invite Classmates</label>
											<div className="flex flex-col sm:flex-row gap-3">
												<div className="flex-1 relative">
													<input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 h-11 px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Enter email addresses..." />
													<div className="absolute right-2 top-1/2 -translate-y-1/2">
														<select className="bg-transparent border-none text-xs font-medium text-slate-500 focus:ring-0 cursor-pointer">
															<option>Can Edit</option>
															<option>Can View</option>
														</select>
													</div>
												</div>
												<button className="flex items-center justify-center rounded-lg h-11 px-6 bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-colors whitespace-nowrap">Send Invite</button>
											</div>
										</div>

										<div>
											<label className="text-slate-900 dark:text-slate-50 text-sm font-bold leading-normal pb-2 block">Public Link</label>
											<div className="flex items-center w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-11 px-1 overflow-hidden">
												<div className="px-3 text-slate-400">
													<span className="material-symbols-outlined text-[20px]">link</span>
												</div>
												<input className="flex-1 bg-transparent border-none text-slate-600 dark:text-slate-300 text-sm truncate focus:ring-0" readOnly defaultValue="https://studynotes.app/share/bio-101-notes-x8d9s" />
												<button className="p-2 mr-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md text-primary font-medium text-xs uppercase tracking-wide transition-colors">Copy</button>
											</div>
											<div className="mt-2 flex items-center gap-2">
												<label className="relative inline-flex items-center cursor-pointer">
													<input className="sr-only peer" type="checkbox" defaultChecked />
													<div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
												</label>
												<span className="text-sm text-slate-500 dark:text-slate-400">Anyone with the link can view</span>
											</div>
										</div>
									</div>
								</div>

								<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
									<h3 className="text-slate-900 dark:text-slate-50 text-lg font-bold mb-4">Active Collaborators</h3>
									<div className="flex flex-col gap-4">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<div className="size-10 rounded-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB1hPRbgWuFmD-jTfKYjgB26FBd9kpsY5Mm8LSm-c28B10VZ9fdifPeu9YTkUMmb1WSKaC2vrZcEJ696EcdiTo2QNJ1KDBlX6M6cU6R3iGmq7nTS7YZldMDyhErSV7AhXn_kVPJgWFo_Urr5QlF9LMyvMoPNQTe6aVFXmNB3TD632XMuWzsZmj1Lz8KcFp8s1O9yoAw2AmLJO5UJYmWWILHEo4AVUZB04MRokvI5LAn_QU18wSE6TpCyDIOVJpxEI5PIJgiL2oTVYtZ")'}}></div>
												<div>
													<p className="text-slate-900 dark:text-slate-50 text-sm font-semibold">Sarah Chen (You)</p>
													<p className="text-slate-500 dark:text-slate-400 text-xs">sarah.chen@university.edu</p>
												</div>
											</div>
											<span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-primary">Owner</span>
										</div>

										<div className="flex items-center justify-between group">
											<div className="flex items-center gap-3">
												<div className="size-10 rounded-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCFFzTVML4QhXQBq4NPAp3Ie5OvQUNMmasqE2vyveRR8E-1w58PvrzQjO9fZzpT9X8KfXTz_PcZgxIjcjVsPiniSD-jBQdoRTBU0o_ZJzFjhyj42AdxFWGa6ryC3iTOD154uJQzNxpekBHwYASctWMcHhf_vuiexLl-H-lmaKaxYhxkOqRYkeM2Synxenr29Elp_vUFdgsqzKs2IQ2BatlKtNcFOqqcppstXxxYw7Qb5jhnSspmliLJGQnoCDGAYUAHHtJWytK0Bprn")'}}></div>
												<div>
													<p className="text-slate-900 dark:text-slate-50 text-sm font-semibold">Marcus Johnson</p>
													<p className="text-slate-500 dark:text-slate-400 text-xs">marcus.j@university.edu</p>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<select className="bg-transparent text-xs font-medium text-slate-500 dark:text-slate-400 border-none focus:ring-0 cursor-pointer hover:text-primary">
													<option defaultValue>Editor</option>
													<option>Viewer</option>
													<option>Remove</option>
												</select>
											</div>
										</div>

										<div className="flex items-center justify-between group">
											<div className="flex items-center gap-3">
												<div className="size-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-sm">AL</div>
												<div>
													<p className="text-slate-900 dark:text-slate-50 text-sm font-semibold">Ana Lopez</p>
													<p className="text-slate-500 dark:text-slate-400 text-xs">ana.lopez@university.edu</p>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<select className="bg-transparent text-xs font-medium text-slate-500 dark:text-slate-400 border-none focus:ring-0 cursor-pointer hover:text-primary">
													<option>Editor</option>
													<option defaultValue>Viewer</option>
													<option>Remove</option>
												</select>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="flex flex-col gap-6">
								<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-full">
									<div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
										<h3 className="text-slate-900 dark:text-slate-50 text-xl font-bold flex items-center gap-2">
											<span className="material-symbols-outlined text-primary">hub</span>
											External Integrations
										</h3>
										<button className="text-primary text-sm font-bold hover:underline">Manage All</button>
									</div>
									<div className="p-6">
										<p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Connect your favorite tools to automatically import highlights, video timestamps, and references.</p>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div className="group relative flex flex-col items-start gap-4 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:border-primary/50 transition-all bg-slate-50 dark:bg-slate-800/50">
												<div className="flex w-full items-start justify-between">
													<div className="flex size-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
														<span className="material-symbols-outlined">smart_display</span>
													</div>
													<div className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Active</div>
												</div>
												<div>
													<p className="text-slate-900 dark:text-slate-50 font-bold text-base">YouTube</p>
													<p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Embed timestamps &amp; transcripts</p>
												</div>
												<label className="relative inline-flex items-center cursor-pointer mt-auto">
													<input className="sr-only peer" type="checkbox" defaultChecked />
													<div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
												</label>
											</div>

											<div className="group relative flex flex-col items-start gap-4 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:border-primary/50 transition-all bg-white dark:bg-slate-800/50">
												<div className="flex w-full items-start justify-between">
													<div className="flex size-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
														<span className="material-symbols-outlined">book_2</span>
													</div>
												</div>
												<div>
													<p className="text-slate-900 dark:text-slate-50 font-bold text-base">Kindle</p>
													<p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Sync book highlights &amp; notes</p>
												</div>
												<button className="mt-auto text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-md transition-colors">Connect</button>
											</div>

											<div className="group relative flex flex-col items-start gap-4 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:border-primary/50 transition-all bg-white dark:bg-slate-800/50">
												<div className="flex w-full items-start justify-between">
													<div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
														<span className="material-symbols-outlined">add_to_drive</span>
													</div>
												</div>
												<div>
													<p className="text-slate-900 dark:text-slate-50 font-bold text-base">Google Drive</p>
													<p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Import PDF &amp; Docs directly</p>
												</div>
												<button className="mt-auto text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-md transition-colors">Connect</button>
											</div>

											<div className="group relative flex flex-col items-start gap-4 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:border-primary/50 transition-all bg-white dark:bg-slate-800/50">
												<div className="flex w-full items-start justify-between">
													<div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
														<span className="material-symbols-outlined">edit_note</span>
													</div>
												</div>
												<div>
													<p className="text-slate-900 dark:text-slate-50 font-bold text-base">Notion</p>
													<p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Two-way sync for pages</p>
												</div>
												<button className="mt-auto text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-md transition-colors">Connect</button>
											</div>
										</div>

										<div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
											<h4 className="text-slate-900 dark:text-slate-50 font-bold text-sm mb-3">Quick Import</h4>
											<div className="flex gap-2">
												<input className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Paste a URL to import content..." />
												<button className="flex items-center justify-center rounded-lg size-10 bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors">
													<span className="material-symbols-outlined">download</span>
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}
